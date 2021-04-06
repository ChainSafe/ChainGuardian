import {HttpClient} from "../../../api";
import {IBeaconConfig} from "@chainsafe/lodestar-config";
import {SignedBeaconBlock} from "@chainsafe/lodestar-types";
import {Json, List} from "@chainsafe/ssz";
import {ICGETH2BeaconBlocksApi} from "../interface";
import {Attestation} from "@chainsafe/lodestar-types/lib/types/operations";
import {matomo} from "../../../tracking";

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
        if (process.env.NODE_ENV !== "validator-test")
            if (matomo) matomo.trackEvent({category: "block", action: "proposed", value: block.message.slot});
    };

    public getBlock = async (blockId: "head" | "genesis" | "finalized" | number): Promise<SignedBeaconBlock> => {
        const blocksResponse = await this.httpClient.get<{data: Json}>(`/eth/v1/beacon/blocks/${blockId}`);
        return this.config.types.SignedBeaconBlock.fromJson(blocksResponse.data, {case: "snake"});
    };

    public getBlockAttestations = async (
        blockId: "head" | "genesis" | "finalized" | number,
    ): Promise<List<Attestation> | null> => {
        const block = await this.getBlock(blockId);

        if (typeof blockId === "number" && block.message.slot !== blockId) return null;
        return block.message.body.attestations;
    };
}
