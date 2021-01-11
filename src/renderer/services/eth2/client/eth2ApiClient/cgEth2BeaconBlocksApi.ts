import {HttpClient} from "../../../api";
import {IBeaconConfig} from "@chainsafe/lodestar-config";
import {SignedBeaconBlock} from "@chainsafe/lodestar-types";
import {Json} from "@chainsafe/ssz";
import {BlockAttestations, ICGETH2BeaconBlocksApi} from "../interface";

interface IGetBlockAttestations {
    data: {
        message: {
            slot: string;
            body: {
                attestations: {
                    // eslint-disable-next-line camelcase
                    aggregation_bits: string;
                    signature: string;
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
                }[];
            };
        };
    };
}

export class CgEth2BeaconBlocksApi implements ICGETH2BeaconBlocksApi {
    private readonly httpClient: HttpClient;
    private readonly config: IBeaconConfig;
    public constructor(config: IBeaconConfig, httpClient: HttpClient) {
        this.config = config;
        this.httpClient = httpClient;
    }

    public publishBlock = async (block: SignedBeaconBlock): Promise<void> => {
        await this.httpClient.post(
            "/eth/v1/beacon/blocks",
            this.config.types.SignedBeaconBlock.toJson(block, {case: "snake"}),
        );
    };

    public getBlock = async (blockId: "head" | "genesis" | "finalized" | number): Promise<SignedBeaconBlock> => {
        const blocksResponse = await this.httpClient.get<{data: Json}>(`/eth/v1/beacon/blocks/${blockId}`);
        return this.config.types.SignedBeaconBlock.fromJson(blocksResponse.data, {case: "snake"});
    };

    public getBlockAttestations = async (
        blockId: "head" | "genesis" | "finalized" | number,
    ): Promise<BlockAttestations[] | null> => {
        const blocksResponse = await this.httpClient.get<IGetBlockAttestations>(`/eth/v1/beacon/blocks/${blockId}`);
        if (typeof blockId === "number" && Number(blocksResponse.data.message.slot) !== blockId) return null;
        return blocksResponse.data.message.body.attestations.map((attestation) => ({
            aggregationBits: attestation.aggregation_bits,
            signature: attestation.signature,
            data: {
                slot: Number(attestation.data.slot),
                index: Number(attestation.data.index),
                beaconBlockRoot: attestation.data.beacon_block_root,
                source: {
                    epoch: Number(attestation.data.source),
                    root: attestation.data.source.root,
                },
                target: {
                    epoch: Number(attestation.data.target),
                    root: attestation.data.target.root,
                },
            },
        }));
    };
}
