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
        const url = new URL(`/eth/v1/events?topics=${topicsQuery}`, this.baseUrl);
        const eventSource = new EventSource(url.href);
        return new LodestarEventIterator(({push}): (() => void) => {
            topics.forEach((topic) => {
                eventSource.addEventListener(topic, this.eventListener(push));
            });
            return (): void => {
                eventSource.close();
            };
        });
    };

    private eventListener = (push: (value: BeaconEvent) => void) => (event: Event): void => {
        push(this.deserializeBeaconEventMessage(event as MessageEvent));
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
            case BeaconEventType.HEAD:
                return {
                    type: BeaconEventType.HEAD,
                    message: this.deserializeEventData(this.config.types.ChainHead, msg.data),
                };
            default:
                throw new Error("Unsupported beacon event type " + msg.type);
        }
    };

    private deserializeEventData = <T extends BeaconEvent["message"]>(type: ContainerType<T>, data: string): T => {
        return type.fromJson(JSON.parse(data), {case: "snake"});
    };
}
