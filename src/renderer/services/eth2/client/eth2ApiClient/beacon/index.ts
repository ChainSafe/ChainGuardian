import {ICGEth2BeaconApi} from "../../interface";
import {IBeaconBlocksApi, IBeaconPoolApi} from "@chainsafe/lodestar-validator/lib/api/interface/beacon";
import {
    Attestation,
    BeaconBlock,
    BeaconState,
    BLSPubkey,
    Fork,
    Genesis,
    SignedBeaconBlock,
    SignedBeaconHeaderResponse,
    ValidatorIndex,
    ValidatorResponse,
} from "@chainsafe/lodestar-types";
import {HttpClient} from "../../../../api";
import {IBeaconConfig} from "@chainsafe/lodestar-config";

export class Beacon implements ICGEth2BeaconApi {
    public blocks: IBeaconBlocksApi = {
        publishBlock: async (block: SignedBeaconBlock): Promise<void> => {
            console.log("publishBlock", block);
        },
    };
    public pool: IBeaconPoolApi = {
        submitAttestation: async (attestation: Attestation): Promise<void> => {
            console.log("submitAttestation", attestation);
        },
    };
    public state: ICGEth2BeaconApi["state"] = {
        getFork: async (stateId: "head"): Promise<Fork | null> => {
            console.log("getFork", stateId);
            return null;
        },
        getStateValidator: async (
            stateId: "head",
            validatorId: ValidatorIndex | BLSPubkey,
        ): Promise<ValidatorResponse | null> => {
            console.log("getStateValidator", stateId, validatorId);
            return null;
        },
        getBlockHeader: async (
            stateId: "head",
            blockId: "head" | number | string,
        ): Promise<SignedBeaconHeaderResponse> => {
            console.log("getBlockHeader", stateId, blockId);
            return undefined as SignedBeaconHeaderResponse;
        },
        getValidator: async (
            stateId: "head",
            validatorId: string | BLSPubkey | ValidatorIndex,
        ): Promise<ValidatorResponse> => {
            console.log("getValidator", stateId, validatorId);
            return undefined as ValidatorResponse;
        },
        getValidators: async (
            stateId?: "head",
            validatorIds?: (string | ValidatorIndex)[],
        ): Promise<ValidatorResponse[]> => {
            console.log("getValidators", stateId, validatorIds);
            return undefined as ValidatorResponse[];
        },
    };

    private readonly httpClient: HttpClient;
    private readonly config: IBeaconConfig;
    public constructor(config: IBeaconConfig, httpClient: HttpClient) {
        this.config = config;
        this.httpClient = httpClient;
    }

    public getGenesis = async (): Promise<Genesis | null> => {
        console.log("getGenesis");
        return null;
    };

    public getChainHead = async (): Promise<BeaconBlock> => {
        throw new Error("Method 'getChainHead' not implemented.");
    };

    public getBeaconState = async (): Promise<BeaconState> => {
        throw new Error("Method 'getBeaconState' not implemented.");
    };
}
