import {CgEth2EventsApi} from "../eth2ApiClient/CgEth2EventsApi";
import {BeaconEvent, Topics} from "../interface";
import {EventType as ChainSafeEventType} from "@chainsafe/lodestar-api/lib/routes/events";
import {EventType} from "../enums";
import {HttpClient} from "../../../api/http/httpClient";
import {computeEpochAtSlot, computeStartSlotAtEpoch} from "@chainsafe/lodestar-beacon-state-transition";
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

    public async eventstream(
        topics: Topics[],
        signal: AbortSignal,
        onEvent: (event: BeaconEvent) => void,
        softErrorHandling = false,
    ): Promise<void> {
        const httpClient = new HttpClient(this.url + "/eth/v1/beacon");
        let interval: NodeJS.Timeout;

        console.warn(topics);

        await new Promise<void>((resolve, reject) => {
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

                            if (topics.some((topic) => topic === EventType.block))
                                onEvent({
                                    type: EventType.block,
                                    message: this.eventSerdes.fromJson(EventType.block as ChainSafeEventType, {
                                        slot,
                                        block: result.data.root,
                                    }),
                                } as BeaconEvent);

                            const epoch = computeEpochAtSlot(slot);
                            if (this.currentBlock.epoch !== epoch) {
                                this.previousDepend = this.depend;
                                this.depend = this.currentBlock;
                            }

                            if (topics.some((topic) => topic === EventType.head))
                                // root => block
                                // state => header.message.state_root
                                // epoch_transition => on epoch changed
                                // TODO: ⇩ implement after ssz add this fields ⇩
                                // previous_duty_dependent_root => if epoch_transition then state before
                                // current_duty_dependent_root => if epoch_transition then state before
                                onEvent({
                                    type: EventType.head,
                                    message: this.eventSerdes.fromJson(EventType.head as ChainSafeEventType, {
                                        slot,
                                        block: result.data.root,
                                        state: result.data.header.message.state_root,
                                        // eslint-disable-next-line camelcase,@typescript-eslint/camelcase
                                        epoch_transition: this.currentBlock.epoch !== epoch,
                                        // eslint-disable-next-line camelcase,@typescript-eslint/camelcase
                                        previous_duty_dependent_root: this.previousDepend.state,
                                        // eslint-disable-next-line camelcase,@typescript-eslint/camelcase
                                        current_duty_dependent_root: this.depend.state,
                                    }),
                                } as BeaconEvent);

                            this.currentBlock = {
                                slot,
                                epoch,
                                state: result.data.root,
                            };
                        }

                        if (topics.some((topic) => topic === EventType.attestation)) {
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
                                    onEvent({
                                        type: EventType.attestation,
                                        message: this.eventSerdes.fromJson(
                                            EventType.attestation as ChainSafeEventType,
                                            attestation,
                                        ),
                                    } as BeaconEvent);
                                }
                            }
                        }
                    } catch (error) {
                        console.warn(error);
                        if (softErrorHandling) onEvent({type: EventType.error, message: error} as BeaconEvent);
                        else {
                            // Consider 400 and 500 status errors unrecoverable, close the eventsource
                            if (error.code === 400) {
                                reject(Error(`400 Invalid topics: ${error.message}`));
                            }
                            if (error.code === 500) {
                                reject(Error(`500 Internal Server Error: ${error.message}`));
                            }
                        }
                    }
                }, 1000) as unknown) as NodeJS.Timeout;
            })();

            signal.addEventListener(
                "abort",
                (): void => {
                    if (interval) clearInterval(interval);
                    resolve();
                },
                {once: true},
            );
        });
    }

    private initializeEventPooling = async (httpClient: HttpClient): Promise<void> => {
        if (!this.currentBlock || !this.depend || !this.previousDepend) {
            if (!this.currentBlock) {
                const result = await httpClient.get<BlockResponse>("headers/head");
                const slot = Number(result.data.header.message.slot);
                this.currentBlock = {
                    slot,
                    epoch: computeEpochAtSlot(slot),
                    state: result.data.root,
                };
            }
            if (!this.depend) {
                try {
                    const previousEpochLastSlot = computeStartSlotAtEpoch(this.currentBlock.epoch) - 1;
                    const result = await httpClient.get<BlockResponse>(`headers/${previousEpochLastSlot}`);
                    const slot = Number(result.data.header.message.slot);
                    this.depend = {
                        slot,
                        epoch: computeEpochAtSlot(slot),
                        state: result.data.root,
                    };
                } catch (e) {
                    cgLogger.warn("Event error while fetching depend", e);
                }
            }
            if (!this.previousDepend) {
                try {
                    const previousEpochLastSlot = computeStartSlotAtEpoch(this.depend.epoch) - 1;
                    const result = await httpClient.get<BlockResponse>(`headers/${previousEpochLastSlot}`);
                    const slot = Number(result.data.header.message.slot);
                    this.previousDepend = {
                        slot,
                        epoch: computeEpochAtSlot(slot),
                        state: result.data.root,
                    };
                } catch (e) {
                    cgLogger.warn("Event error while fetching previousDepend", e);
                }
            }
        }
    };
}
