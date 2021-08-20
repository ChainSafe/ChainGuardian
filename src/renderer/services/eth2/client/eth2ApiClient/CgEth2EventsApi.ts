import {getEventSerdes, EventType as ChainSafeEventType} from "@chainsafe/lodestar-api/lib/routes/events";
import {stringifyQuery} from "@chainsafe/lodestar-api/lib/client/utils/format";
import EventSource from "eventsource";
import {IChainForkConfig} from "@chainsafe/lodestar-config/lib/beaconConfig";
import {CgEventsApi, BeaconEvent, Topics} from "../interface";
import {EventType} from "../enums";

type EventSourceError = {status: number; message: string};

export class CgEth2EventsApi implements CgEventsApi {
    private readonly eventSerdes = getEventSerdes();
    private readonly url: string;
    private readonly config: IChainForkConfig;

    public constructor(config: IChainForkConfig, url: string) {
        this.url = url;
        this.config = config;
    }

    public async eventstream(
        topics: Topics[],
        signal: AbortSignal,
        onEvent: (event: BeaconEvent) => void,
        softErrorHandling = false,
    ): Promise<void> {
        const query = stringifyQuery({topics});
        // TODO: Use a proper URL formatter
        const url = `${this.url}/eth/v1/events?${query}`;
        const eventSource = new EventSource(url);

        try {
            await new Promise<void>((resolve, reject) => {
                for (const topic of topics) {
                    eventSource.addEventListener(topic, ((event: MessageEvent) => {
                        const message = this.eventSerdes.fromJson(topic as ChainSafeEventType, JSON.parse(event.data));
                        onEvent({type: topic, message} as BeaconEvent);
                    }) as EventListener);
                }

                if (softErrorHandling)
                    eventSource.onerror = function onerror(error): void {
                        onEvent({type: EventType.error, message: error} as BeaconEvent);
                    };
                else
                    eventSource.onerror = function onerror(err): void {
                        const errEs = (err as unknown) as EventSourceError;
                        // Consider 400 and 500 status errors unrecoverable, close the eventsource
                        if (errEs.status === 400) {
                            reject(Error(`400 Invalid topics: ${errEs.message}`));
                        }
                        if (errEs.status === 500) {
                            reject(Error(`500 Internal Server Error: ${errEs.message}`));
                        }
                    };

                signal.addEventListener("abort", () => resolve(), {once: true});
            });
        } finally {
            eventSource.close();
        }
    }
}
