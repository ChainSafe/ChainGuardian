import {CgEth2BeaconStateApi} from "../eth2ApiClient/cgEth2BeaconStateApi";
import {IBeaconConfig} from "@chainsafe/lodestar-config";
import {HttpClient} from "../../../api";
import {BeaconCommitteeResponse, BLSPubkey, Fork, ValidatorIndex} from "@chainsafe/lodestar-types";
import {ICGValidatorResponse} from "../interface";
import {cgLogger} from "../../../../../main/logger";
import {base64ToHex, hexToBase64, stringToBase64} from "./utils";
import logger from "electron-log";
import {ValidatorStateResponse, ValidatorStatusResponse} from "./types";
import {Json} from "@chainsafe/ssz";

export class CgPrysmEth2BeaconStateApi extends CgEth2BeaconStateApi {
    public constructor(config: IBeaconConfig, httpClient: HttpClient) {
        super(config, httpClient);
    }

    public getFork = async (stateId: "head"): Promise<Fork | null> => {
        try {
            const state = typeof stateId === "string" ? stringToBase64(stateId) : stringToBase64(String(stateId));
            const forkResponse = await this.httpClient.get<{
                data: {
                    // eslint-disable-next-line camelcase
                    previous_version: string;
                    // eslint-disable-next-line camelcase
                    current_version: string;
                    epoch: string;
                };
            }>(`/eth/v1/beacon/states/${state}/fork`);

            return this.config.types.Fork.fromJson({
                previousVersion: base64ToHex(forkResponse.data.previous_version),
                currentVersion: base64ToHex(forkResponse.data.current_version),
                epoch: forkResponse.data.epoch,
            });
        } catch (e) {
            logger.error("Failed to fetch head fork version", {error: e.message});
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
            const query =
                typeof validatorId === "number"
                    ? `index=${validatorId}`
                    : `public_key=${encodeURIComponent(hexToBase64(id))}`;

            const [stateValidatorResponse, statusValidatorResponse, indexValidatorResponse] = await Promise.all([
                this.httpClient.get<ValidatorStatusResponse>(`/eth/v1alpha1/validator?${query}`),
                this.httpClient.get<ValidatorStateResponse>(`/eth/v1alpha1/validator/status?${query}`),
                this.httpClient.get<{index: string}>(`/eth/v1alpha1/validator/index?${query}`),
            ]);

            return this.config.types.ValidatorResponse.fromJson({
                index: indexValidatorResponse.index,
                balance: stateValidatorResponse.effectiveBalance,
                status: statusValidatorResponse.status,
                validator: {
                    ...stateValidatorResponse,
                    pubkey: base64ToHex(stateValidatorResponse.publicKey),
                    withdrawalCredentials: base64ToHex(stateValidatorResponse.withdrawalCredentials),
                },
            }) as ICGValidatorResponse;
        } catch (e) {
            if (!e.message.includes('"code":404'))
                cgLogger.error("Failed to fetch validator", {validatorId: id, error: e.message});
            return null;
        }
    };

    public getLastEpoch = async (): Promise<bigint | null> => {
        try {
            const url = `/eth/v1/beacon/states/aGVhZA==/finality_checkpoints`;
            const finalityCheckpointsResponse = await this.httpClient.get<{
                // eslint-disable-next-line camelcase
                data: {previous_justified: {epoch: string}};
            }>(url);
            return BigInt(finalityCheckpointsResponse.data.previous_justified.epoch);
        } catch (e) {
            logger.error("Failed to fetch finality checkpoints", {error: e.message});
            return null;
        }
    };

    public getCommittees = async (stateId: "head" | number = "head"): Promise<BeaconCommitteeResponse[]> => {
        const state = typeof stateId === "string" ? stringToBase64(stateId) : stringToBase64(String(stateId));
        const url = `/eth/v1/beacon/states/${state}/committees`;
        const committeesResponse = await this.httpClient.get<any>(url);
        return committeesResponse.data.map((data: Json) =>
            this.config.types.BeaconCommitteeResponse.fromJson(data, {case: "snake"}),
        );
    };
}
