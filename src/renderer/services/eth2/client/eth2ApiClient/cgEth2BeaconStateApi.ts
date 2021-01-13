import {BLSPubkey, Fork, ValidatorIndex} from "@chainsafe/lodestar-types";
import {HttpClient} from "../../../api";
import {IBeaconConfig} from "@chainsafe/lodestar-config";
import {Json} from "@chainsafe/ssz";
import {ICGBeaconStateApi, ICGValidatorResponse} from "../interface";
import logger from "electron-log";

export class CgEth2BeaconStateApi implements ICGBeaconStateApi {
    private readonly httpClient: HttpClient;
    private readonly config: IBeaconConfig;
    public constructor(config: IBeaconConfig, httpClient: HttpClient) {
        this.config = config;
        this.httpClient = httpClient;
    }

    public getFork = async (stateId: "head"): Promise<Fork | null> => {
        try {
            const forkResponse = await this.httpClient.get<{data: Json}>(`/eth/v1/beacon/states/${stateId}/fork`);
            return this.config.types.Fork.fromJson(forkResponse.data, {case: "snake"});
        } catch (e) {
            logger.error("Failed to fetch head fork version", JSON.stringify({error: e.message}));
            return null;
        }
    };

    public getLastEpoch = async (): Promise<bigint | null> => {
        try {
            const url = `/eth/v1/beacon/states/head/finality_checkpoints`;
            const finalityCheckpointsResponse = await this.httpClient.get<{
                // eslint-disable-next-line camelcase
                data: {previous_justified: {epoch: number}};
            }>(url);
            return BigInt(finalityCheckpointsResponse.data.previous_justified.epoch);
        } catch (e) {
            console.error("Failed to fetch finality checkpoints", JSON.stringify({error: e.message}));
            return null;
        }
    };

    public getStateValidator = async (
        stateId: "head" | number,
        validatorId: ValidatorIndex | BLSPubkey,
    ): Promise<ICGValidatorResponse | null> => {
        const id =
            typeof validatorId === "number"
                ? validatorId.toString()
                : this.config.types.BLSPubkey.toJson(validatorId)?.toString() ?? "";
        try {
            const url = `/eth/v1/beacon/states/${stateId}/validators/${id}`;
            const stateValidatorResponse = await this.httpClient.get<{data: Json}>(url);
            return this.config.types.ValidatorResponse.fromJson(stateValidatorResponse.data, {
                case: "snake",
            }) as ICGValidatorResponse;
        } catch (e) {
            logger.error("Failed to fetch validator", JSON.stringify({validatorId: id, error: e.message}));
            return null;
        }
    };
}
