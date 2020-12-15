import {BeaconEvent, BeaconEventType, IEventsApi} from "@chainsafe/lodestar-validator/lib/api/interface/events";
import {IStoppableEventIterable, LodestarEventIterator} from "@chainsafe/lodestar-utils";
import {IBeaconConfig} from "@chainsafe/lodestar-config";
import {ContainerType} from "@chainsafe/ssz";

export class CgEth2EventsApi implements IEventsApi {
    private readonly baseUrl: string;
    private readonly config: IBeaconConfig;
    public constructor(config: IBeaconConfig, baseUrl: string) {
        this.config = config;
        this.baseUrl = baseUrl;
    }

    public getEventStream = (topics: BeaconEventType[]): IStoppableEventIterable<BeaconEvent> => {
        const topicsQuery = topics.filter((topic) => topic !== "chain_reorg").join(",");
        const url = `${this.baseUrl.replace(/\/+$/, "")}/eth/v1/events?topics=${topicsQuery}`;
        const eventSource = new EventSource(url);
        return new LodestarEventIterator(({push}): (() => void) => {
            eventSource.onmessage = (event): void => {
                if (topics.includes(event.type as BeaconEventType)) {
                    push(this.deserializeBeaconEventMessage(event));
                }
            };
            return (): void => {
                eventSource.close();
            };
        });
    };

    private deserializeBeaconEventMessage = (msg: MessageEvent): BeaconEvent => {
        switch (msg.type) {
            case BeaconEventType.BLOCK:
                return {
                    type: BeaconEventType.BLOCK,
                    message: this.deserializeEventData(this.config.types.BlockEventPayload, msg.data),
                };
            case BeaconEventType.CHAIN_REORG:
                return {
                    type: BeaconEventType.CHAIN_REORG,
                    message: this.deserializeEventData(this.config.types.ChainReorg, msg.data),
                };
            default:
                throw new Error("Unsupported beacon event type " + msg.type);
        }
    };

    private deserializeEventData = <T extends BeaconEvent["message"]>(type: ContainerType<T>, data: string): T => {
        return type.fromJson(JSON.parse(data));
    };
}
