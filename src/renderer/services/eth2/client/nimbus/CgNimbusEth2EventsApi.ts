import {CgEth2EventsApi, EventSourceError} from "../eth2ApiClient/CgEth2EventsApi";
import {BeaconEvent, Topics} from "../interface";
import {stringifyQuery} from "@chainsafe/lodestar-api/lib/client/utils/format";
import EventSource from "eventsource";
import {EventType as ChainSafeEventType} from "@chainsafe/lodestar-api/lib/routes/events";
import {EventType} from "../enums";

export class CgNimbusEth2EventsApi extends CgEth2EventsApi {
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

        try {
            await new Promise<void>((resolve, reject) => {
                for (const topic of topics) {
                    eventSource.addEventListener(topic, ((event: MessageEvent) => {
                        // TODO: remove after nimbus release next version after 1.5.0
                        //  https://github.com/status-im/nimbus-eth2/pull/2957
                        if (topic === EventType.head)
                            // eslint-disable-next-line no-param-reassign
                            event = {
                                ...event,
                                data: event.data
                                    .replace("current_duty_depenedent_root", "current_duty_dependent_root")
                                    .replace("block_root", "block")
                                    .replace("state_root", "state"),
                            };

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
