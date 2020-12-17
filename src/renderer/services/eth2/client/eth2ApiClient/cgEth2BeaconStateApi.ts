import {BLSPubkey, Fork, ValidatorIndex, ValidatorResponse} from "@chainsafe/lodestar-types";
import {HttpClient} from "../../../api";
import {IBeaconConfig} from "@chainsafe/lodestar-config";
import {Json} from "@chainsafe/ssz";
import {IBeaconStateApi} from "@chainsafe/lodestar-validator/lib/api/interface/beacon";

export class CgEth2BeaconStateApi implements IBeaconStateApi {
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
}
