import {CgEth2EventsApi} from "../eth2ApiClient/cgEth2EventsApi";
import {CGBeaconEvent, CGBeaconEventType, ErrorEvent} from "../interface";
import {IStoppableEventIterable, LodestarEventIterator} from "@chainsafe/lodestar-utils";
import EventSource from "eventsource";
import {BeaconEventType} from "@chainsafe/lodestar-validator/lib/api/interface/events";
import {base64ToHex} from "./utils";

type PrysmEventData = {
    "@type": string;
    slot: string;
    block: string;
    state: string;
    // eslint-disable-next-line camelcase
    epoch_transition: boolean;
    // eslint-disable-next-line camelcase
    previous_duty_dependent_root: string;
    // eslint-disable-next-line camelcase
    current_duty_dependent_root: string;
    // eslint-disable-next-line camelcase
    aggregation_bits: string;
    data: {
        slot: string;
        index: string;
        // eslint-disable-next-line camelcase
        beacon_block_root: string;
        source: {
            epoch: string;
            root: string;
        };
        target: {
            epoch: string;
            root: string;
        };
    };
    signature: string;
};

export class CgPrysmEth2EventsApi extends CgEth2EventsApi {
    public getEventStream = (topics: CGBeaconEventType[]): IStoppableEventIterable<CGBeaconEvent | ErrorEvent> => {
        const topicsQuery = topics.filter((topic) => topic !== "chain_reorg").join("&topics=");
        const url = new URL(`/eth/v1/events?topics=${topicsQuery}`, this.baseUrl);
        const eventSource = new EventSource(url.href);
        return new LodestarEventIterator(({push}): (() => void) => {
            eventSource.addEventListener("message", this.prysmEventListener(push));
            eventSource.addEventListener("error", () => {
                push({type: CGBeaconEventType.ERROR});
            });
            return (): void => {
                eventSource.close();
            };
        });
    };

    private prysmEventListener = (push: (value: CGBeaconEvent) => void) => (event: Event): void => {
        const data: PrysmEventData = JSON.parse(((event as unknown) as {data: string}).data);
        switch (data["@type"]) {
            case "type.googleapis.com/ethereum.eth.v1.EventBlock":
                push({
                    type: BeaconEventType.BLOCK,
                    message: this.config.types.BlockEventPayload.fromJson({
                        slot: data.slot,
                        block: base64ToHex(data.block),
                    }),
                });
                break;
            case "type.googleapis.com/ethereum.eth.v1.EventHead":
                push({
                    type: BeaconEventType.HEAD,
                    message: this.config.types.ChainHead.fromJson({
                        slot: data.slot,
                        block: base64ToHex(data.block),
                        state: base64ToHex(data.state),
                        epochTransition: data.epoch_transition,
                        previousDutyDependentRoot: base64ToHex(data.previous_duty_dependent_root),
                        currentDutyDependentRoot: base64ToHex(data.current_duty_dependent_root),
                    }),
                });
                break;
            case "type.googleapis.com/ethereum.eth.v1.Attestation":
                push({
                    type: CGBeaconEventType.ATTESTATION,
                    message: this.config.types.Attestation.fromJson({
                        aggregationBits: base64ToHex(data.aggregation_bits),
                        data: {
                            slot: data.data.slot,
                            index: data.data.index,
                            beaconBlockRoot: base64ToHex(data.data.beacon_block_root),
                            source: {
                                epoch: data.data.source.epoch,
                                root: base64ToHex(data.data.source.root),
                            },
                            target: {
                                epoch: data.data.target.epoch,
                                root: base64ToHex(data.data.target.root),
                            },
                        },
                        signature: base64ToHex(data.signature),
                    }),
                });
                break;
            default:
                console.log(data);
                throw new Error("Unsupported beacon event type " + data["@type"]);
        }
    };
}
