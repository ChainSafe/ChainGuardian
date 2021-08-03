import {IBeaconConfig} from "@chainsafe/lodestar-config";
import {CgEth2EventsApi} from "../eth2ApiClient/cgEth2EventsApi";
import {CGBeaconEvent, CGBeaconEventType, ErrorEvent} from "../interface";
import {IStoppableEventIterable, LodestarEventIterator} from "@chainsafe/lodestar-utils";
import {HttpClient} from "../../../api";
import {computeEpochAtSlot, computeStartSlotAtEpoch} from "@chainsafe/lodestar-beacon-state-transition/lib/util/epoch";
import {BeaconEventType} from "@chainsafe/lodestar-validator/lib/api/interface/events";
import {cgLogger} from "../../../../../main/logger";

type BlockState = {
    slot: number;
    epoch: number;
    state: string;
};

type BlockResponse = {
    data: {
        root: string;
        canonical: boolean;
        header: {
            message: {
                slot: string;
                // eslint-disable-next-line camelcase
                proposer_index: string;
                // eslint-disable-next-line camelcase
                parent_root: string;
                // eslint-disable-next-line camelcase
                state_root: string;
                // eslint-disable-next-line camelcase
                body_root: string;
            };
            signature: string;
        };
    };
};

type PushedAttestation = {
    slot: number;
    index: number;
    beaconBlockRoot: string;
};

type Attestation = {
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

export class CgNimbusEth2EventsApi extends CgEth2EventsApi {
    private currentBlock: BlockState;
    private depend: BlockState;
    private previousDepend: BlockState;
    private pushedAttestation: PushedAttestation[] = [];

    public constructor(config: IBeaconConfig, baseUrl: string) {
        super(config, baseUrl);
    }

    // topics: head, block, attestation, voluntary_exit, finalized_checkpoint, chain_reorg
    public getEventStream = (topics: CGBeaconEventType[]): IStoppableEventIterable<CGBeaconEvent | ErrorEvent> => {
        const httpClient = new HttpClient(this.baseUrl + "/eth/v1/beacon");
        return new LodestarEventIterator(({push}): (() => void) => {
            let interval: NodeJS.Timeout;
            (async (): Promise<void> => {
                // eslint-disable-next-line no-constant-condition
                while (true) {
                    try {
                        await this.initializeEventPooling(httpClient);
                        break;
                    } catch (e) {
                        cgLogger.warn("Failed to initialize data", e, "\n Retying...");
                    }
                }

                interval = (setInterval(async () => {
                    try {
                        const result = await httpClient.get<BlockResponse>("headers/head");
                        const slot = Number(result.data.header.message.slot);

                        if (this.currentBlock.slot !== slot) {
                            this.pushedAttestation = [];

                            if (topics.some((topic) => topic === CGBeaconEventType.BLOCK))
                                push({
                                    type: BeaconEventType.BLOCK,
                                    message: this.config.types.BlockEventPayload.fromJson({
                                        slot,
                                        block: result.data.root,
                                    }),
                                });

                            const epoch = computeEpochAtSlot(this.config, slot);
                            if (this.currentBlock.epoch !== epoch) {
                                this.previousDepend = this.depend;
                                this.depend = this.currentBlock;
                            }

                            if (topics.some((topic) => topic === CGBeaconEventType.HEAD))
                                // root => block
                                // state => header.message.state_root
                                // epoch_transition => on epoch changed
                                // TODO: ⇩ implement after ssz add this fields ⇩
                                // previous_duty_dependent_root => if epoch_transition then state before
                                // current_duty_dependent_root => if epoch_transition then state before
                                push({
                                    type: BeaconEventType.HEAD,
                                    message: this.config.types.ChainHead.fromJson({
                                        slot,
                                        block: result.data.root,
                                        state: result.data.header.message.state_root,
                                        epochTransition: this.currentBlock.epoch !== epoch,
                                    }),
                                });

                            this.currentBlock = {
                                slot,
                                epoch,
                                state: result.data.root,
                            };
                        }

                        if (topics.some((topic) => topic === CGBeaconEventType.ATTESTATION)) {
                            const attestations = await httpClient.get<{data: Attestation[]}>(
                                `pool/attestations?slot=${slot}`,
                            );
                            for (const attestation of attestations.data) {
                                const slot = Number(attestation.data.slot);
                                const index = Number(attestation.data.index);
                                if (
                                    !this.pushedAttestation.some(
                                        (pushed) =>
                                            pushed.slot === slot &&
                                            pushed.index === index &&
                                            pushed.beaconBlockRoot === attestation.data.beacon_block_root,
                                    )
                                ) {
                                    this.pushedAttestation.push({
                                        slot,
                                        index,
                                        beaconBlockRoot: attestation.data.beacon_block_root,
                                    });
                                    push({
                                        type: CGBeaconEventType.ATTESTATION,
                                        message: this.config.types.Attestation.fromJson(attestation, {case: "snake"}),
                                    });
                                }
                            }
                        }
                    } catch (e) {
                        push({type: CGBeaconEventType.ERROR});
                    }
                }, 1000) as unknown) as NodeJS.Timeout;
            })();
            return (): void => {
                if (interval) clearInterval(interval);
            };
        });
    };

    private initializeEventPooling = async (httpClient: HttpClient): Promise<void> => {
        if (!this.currentBlock || !this.depend || !this.previousDepend) {
            if (!this.currentBlock) {
                const result = await httpClient.get<BlockResponse>("headers/head");
                const slot = Number(result.data.header.message.slot);
                this.currentBlock = {
                    slot,
                    epoch: computeEpochAtSlot(this.config, slot),
                    state: result.data.root,
                };
            }
            if (!this.depend) {
                try {
                    const previousEpochLastSlot = computeStartSlotAtEpoch(this.config, this.currentBlock.epoch) - 1;
                    const result = await httpClient.get<BlockResponse>(`headers/${previousEpochLastSlot}`);
                    const slot = Number(result.data.header.message.slot);
                    this.depend = {
                        slot,
                        epoch: computeEpochAtSlot(this.config, slot),
                        state: result.data.root,
                    };
                } catch (e) {
                    cgLogger.warn("Event error while fetching depend", e);
                }
            }
            if (!this.previousDepend) {
                try {
                    const previousEpochLastSlot = computeStartSlotAtEpoch(this.config, this.depend.epoch) - 1;
                    const result = await httpClient.get<BlockResponse>(`headers/${previousEpochLastSlot}`);
                    const slot = Number(result.data.header.message.slot);
                    this.previousDepend = {
                        slot,
                        epoch: computeEpochAtSlot(this.config, slot),
                        state: result.data.root,
                    };
                } catch (e) {
                    cgLogger.warn("Event error while fetching previousDepend", e);
                }
            }
        }
    };
}
