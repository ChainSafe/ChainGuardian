import {EventType as ChainSafeEventType} from "@chainsafe/lodestar-api/lib/routes/events";
import EventSource from "eventsource";
import {BeaconEvent, Topics} from "../interface";
import {EventType} from "../enums";
import {stringifyQuery} from "@chainsafe/lodestar-api/lib/client/utils/format";
import {CgEth2EventsApi} from "../eth2ApiClient/CgEth2EventsApi";

type EventSourceError = {status: number; message: string};

export class CgPrysmEth2EventsApi extends CgEth2EventsApi {
    public async eventstream(
        topics: Topics[],
        signal: AbortSignal,
        onEvent: (event: BeaconEvent) => void,
        softErrorHandling = false,
    ): Promise<void> {
        const query = this.mergedQuery ? `topics=${topics.join(",")}` : stringifyQuery({topics});
        // TODO: Use a proper URL formatter
        const url = `${this.url}/eth/v1/events?${query}`;
        const eventSource = new EventSource(url);

        console.warn(url);

        try {
            await new Promise<void>((resolve, reject) => {
                for (const topic of topics) {
                    eventSource.addEventListener(topic, ((event: MessageEvent) => {
                        const data = JSON.parse(event.data);
                        if (topic === "attestation") {
                            console.warn(data);
                            if (data.data !== null) {
                                const message = this.eventSerdes.fromJson(topic as ChainSafeEventType, data);
                                onEvent({type: topic, message} as BeaconEvent);
                            }
                        } else {
                            const message = this.eventSerdes.fromJson(topic as ChainSafeEventType, data);
                            onEvent({type: topic, message} as BeaconEvent);
                        }
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
