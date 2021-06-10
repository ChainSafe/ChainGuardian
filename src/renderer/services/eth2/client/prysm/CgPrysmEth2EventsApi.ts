import {CgEth2EventsApi} from "../eth2ApiClient/cgEth2EventsApi";
import {IBeaconConfig} from "@chainsafe/lodestar-config";
import {CGBeaconEvent, CGBeaconEventType, ErrorEvent} from "../interface";
import {IStoppableEventIterable, LodestarEventIterator} from "@chainsafe/lodestar-utils";
import {PrysmStreamReader} from "./PrysmStreamReader";
import {Attestation as PrysmAttestation, SignedBeaconBlock} from "./types";
import {BeaconEventType} from "@chainsafe/lodestar-validator/lib/api/interface/events";
import {base64ToHex} from "./utils";
import {Attestation} from "@chainsafe/lodestar-types";
import {mapAttestation} from "./mapProduceBlockResponseToStandardProduceBlock";
import {Json} from "@chainsafe/ssz";

export class CgPrysmEth2EventsApi extends CgEth2EventsApi {
    public constructor(config: IBeaconConfig, baseUrl: string) {
        super(config, baseUrl);
    }

    public getEventStream = (topics: CGBeaconEventType[]): IStoppableEventIterable<CGBeaconEvent | ErrorEvent> => {
        const streams: {[key: string]: PrysmStreamReader<any>} = {};
        return new LodestarEventIterator(({push}): (() => void) => {
            // TODO: implement head

            // BLOCK
            if (topics.some((topic) => topic === "block")) {
                const url = new URL(`/eth/v1alpha1/beacon/blocks/stream`, this.baseUrl);
                streams["block"] = new PrysmStreamReader<SignedBeaconBlock>(url);
                streams["block"].on("data", (data: SignedBeaconBlock) => {
                    push({
                        type: BeaconEventType.BLOCK,
                        message: this.config.types.BlockEventPayload.fromJson(
                            {
                                slot: data.block.slot,
                                block: base64ToHex(data.block.state_root),
                            },
                            {case: "snake"},
                        ),
                    });
                });
            }

            // ATTESTATION
            if (topics.some((topic) => topic === "attestation")) {
                const url = new URL(`/eth/v1alpha1/beacon/attestations/stream`, this.baseUrl);
                streams["attestation"] = new PrysmStreamReader<Attestation, {result: PrysmAttestation}>(url, {
                    transformer: (data): Attestation =>
                        this.config.types.Attestation.fromJson((mapAttestation(data.result) as unknown) as Json, {
                            case: "snake",
                        }),
                });
                streams["attestation"].on("data", (data) => {
                    push({
                        type: CGBeaconEventType.ATTESTATION,
                        message: data,
                    });
                });
            }

            // TODO: implement voluntary_exit

            // TODO: implement finalized_checkpoint

            // TODO: implement chain_reorg

            return (): void => {
                Object.keys(streams).forEach((key) => {
                    streams[key].removeAllListeners();
                });
            };
        });
    };
}
