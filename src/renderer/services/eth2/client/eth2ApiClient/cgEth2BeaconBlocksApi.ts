import {HttpClient} from "../../../api";
import {IBeaconConfig} from "@chainsafe/lodestar-config";
import {SignedBeaconBlock} from "@chainsafe/lodestar-types";
import {Json, List} from "@chainsafe/ssz";
import {ICGETH2BeaconBlocksApi} from "../interface";
import {Attestation} from "@chainsafe/lodestar-types/lib/types/operations";
import {matomo} from "../../../tracking";
import {Dispatch} from "redux";
import {publishNewBlock} from "../../../../ducks/validator/actions";

export class CgEth2BeaconBlocksApi implements ICGETH2BeaconBlocksApi {
    protected readonly httpClient: HttpClient;
    protected readonly config: IBeaconConfig;
    protected readonly publicKey?: string;
    protected readonly dispatch?: Dispatch;

    public constructor(config: IBeaconConfig, httpClient: HttpClient, publicKey?: string, dispatch?: Dispatch) {
        this.config = config;
        this.httpClient = httpClient;
        this.publicKey = publicKey;
        this.dispatch = dispatch;
    }

    public publishBlock = async (block: SignedBeaconBlock): Promise<void> => {
        await this.httpClient.post(
            "/eth/v1/beacon/blocks",
            this.config.types.SignedBeaconBlock.toJson(block, {case: "snake"}),
        );
        if (this.publicKey && this.dispatch) {
            this.dispatch(publishNewBlock(this.publicKey, block.message.proposerIndex, block.message.slot));
        }
        if (process.env.NODE_ENV !== "validator-test" && matomo)
            matomo.trackEvent({category: "block", action: "proposed", value: block.message.slot});
    };

    public getBlock = async (blockId: "head" | "genesis" | "finalized" | number): Promise<SignedBeaconBlock> => {
        const blocksResponse = await this.httpClient.get<{data: Json}>(`/eth/v1/beacon/blocks/${blockId}`);
        return this.config.types.SignedBeaconBlock.fromJson(blocksResponse.data, {case: "snake"});
    };

    // TODO: rewrite this to more generic way and then overwrite for the needed cases?
    public getBlockAttestations = async (
        blockId: "head" | "genesis" | "finalized" | number,
    ): Promise<List<Attestation> | null> => {
        const block = await this.getBlock(blockId);

        if (typeof blockId === "number" && block.message.slot !== blockId) return null;
        return block.message.body.attestations;
    };
}
