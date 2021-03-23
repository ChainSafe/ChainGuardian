import {BeaconEventType} from "@chainsafe/lodestar-validator/lib/api/interface/events";
import {IStoppableEventIterable, LodestarEventIterator} from "@chainsafe/lodestar-utils";
import {IBeaconConfig} from "@chainsafe/lodestar-config";
import {ContainerType} from "@chainsafe/ssz";
import {CGBeaconEventType, CGBeaconEvent, ICGEventsApi, ErrorEvent} from "../interface";
import EventSource from "eventsource";

export class CgEth2EventsApi implements ICGEventsApi {
    private readonly baseUrl: string;
    private readonly config: IBeaconConfig;
    public constructor(config: IBeaconConfig, baseUrl: string) {
        this.config = config;
        this.baseUrl = baseUrl;
    }

    public getEventStream = (topics: CGBeaconEventType[]): IStoppableEventIterable<CGBeaconEvent | ErrorEvent> => {
        const topicsQuery = topics.filter((topic) => topic !== "chain_reorg").join(",");
        const url = new URL(`/eth/v1/events?topics=${topicsQuery}`, this.baseUrl);
        const eventSource = new EventSource(url.href);
        return new LodestarEventIterator(({push}): (() => void) => {
            topics.forEach((topic) => {
                eventSource.addEventListener(topic, this.eventListener(push));
            });
            eventSource.addEventListener("error", () => {
                push({type: CGBeaconEventType.ERROR});
            });
            return (): void => {
                eventSource.close();
            };
        });
    };

    private eventListener = (push: (value: CGBeaconEvent) => void) => (event: Event): void => {
        push(this.deserializeBeaconEventMessage(event as MessageEvent));
    };

    private deserializeBeaconEventMessage = (msg: MessageEvent): CGBeaconEvent => {
        switch (msg.type) {
            case CGBeaconEventType.BLOCK:
                return {
                    type: BeaconEventType.BLOCK,
                    message: this.deserializeEventData(this.config.types.BlockEventPayload, msg.data),
                };
            case CGBeaconEventType.CHAIN_REORG:
                return {
                    type: BeaconEventType.CHAIN_REORG,
                    message: this.deserializeEventData(this.config.types.ChainReorg, msg.data),
                };
            case CGBeaconEventType.HEAD:
                return {
                    type: BeaconEventType.HEAD,
                    message: this.deserializeEventData(this.config.types.ChainHead, msg.data),
                };
            case CGBeaconEventType.FINALIZED_CHECKPOINT:
                return {
                    type: CGBeaconEventType.FINALIZED_CHECKPOINT,
                    message: this.deserializeEventData(this.config.types.FinalizedCheckpoint, msg.data),
                };
            case CGBeaconEventType.ATTESTATION:
                return {
                    type: CGBeaconEventType.ATTESTATION,
                    message: this.deserializeEventData(this.config.types.Attestation, msg.data),
                };
            default:
                throw new Error("Unsupported beacon event type " + msg.type);
        }
    };

    private deserializeEventData = <T extends CGBeaconEvent["message"]>(type: ContainerType<T>, data: string): T => {
        return type.fromJson(JSON.parse(data), {case: "snake"});
    };
}
