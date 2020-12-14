import {
    BLSPubkey,
    Fork,
    SignedBeaconHeaderResponse,
    ValidatorIndex,
    ValidatorResponse,
} from "@chainsafe/lodestar-types";
import {ICGEth2BeaconApiState} from "../interface";
import {HttpClient} from "../../../api";
import {IBeaconConfig} from "@chainsafe/lodestar-config";
import {Json} from "@chainsafe/ssz";

export class BeaconState implements ICGEth2BeaconApiState {
    private readonly httpClient: HttpClient;
    private readonly config: IBeaconConfig;
    // TODO: implement logger;
    public constructor(config: IBeaconConfig, httpClient: HttpClient) {
        this.config = config;
        this.httpClient = httpClient;
    }

    public getFork = async (stateId: "head"): Promise<Fork | null> => {
        try {
            const forkResponse = await this.httpClient.get<{data: Json}>(`/eth/v1/beacon/states/${stateId}/fork`);
            return this.config.types.Fork.fromJson(forkResponse.data, {case: "snake"});
        } catch (e) {
            // TODO: implement logger;
            console.error("Failed to fetch head fork version", {error: e.message});
            return null;
        }
    };

    public getStateValidator = async (
        stateId: "head",
        validatorId: ValidatorIndex | BLSPubkey,
    ): Promise<ValidatorResponse | null> => {
        const id =
            typeof validatorId === "number"
                ? validatorId.toString()
                : this.config.types.BLSPubkey.toJson(validatorId)?.toString() ?? "";
        try {
            const url = `/eth/v1/beacon/states/${stateId}/validators/${id}`;
            const stateValidatorResponse = await this.httpClient.get<{data: Json}>(url);
            // TODO: remove hack after ssz is updated
            // @ts-ignore
            stateValidatorResponse.data.pubkey = stateValidatorResponse.data.validator.pubkey;
            return this.config.types.ValidatorResponse.fromJson(stateValidatorResponse.data, {case: "snake"});
        } catch (e) {
            // TODO: implement logger;
            console.error("Failed to fetch validator", {validatorId: id, error: e.message});
            return null;
        }
    };

    public getBlockHeader = async (
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        stateId: "head",
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        blockId: "head" | number | string,
    ): Promise<SignedBeaconHeaderResponse> => {
        throw new Error("Method 'getBlockHeader' not implemented.");
    };

    public getValidator = async (
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        stateId: "head",
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        validatorId: string | BLSPubkey | ValidatorIndex,
    ): Promise<ValidatorResponse> => {
        throw new Error("Method 'getValidator' not implemented.");
    };

    public getValidators = async (
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        stateId?: "head",
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        validatorIds?: (string | ValidatorIndex)[],
    ): Promise<ValidatorResponse[]> => {
        throw new Error("Method 'getValidators' not implemented.");
    };
}
