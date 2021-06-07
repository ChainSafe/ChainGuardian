import {CgEth2BeaconStateApi} from "../eth2ApiClient/cgEth2BeaconStateApi";
import {IBeaconConfig} from "@chainsafe/lodestar-config";
import {HttpClient} from "../../../api";
import {BLSPubkey, Fork, ValidatorIndex} from "@chainsafe/lodestar-types";
import {ICGValidatorResponse} from "../interface";
import {cgLogger} from "../../../../../main/logger";
import {base64ToHex, hexToBase64} from "./utils";
import logger from "electron-log";
import {ValidatorStateResponse, ValidatorStatusResponse} from "./types";

export class CgPrysmEth2BeaconStateApi extends CgEth2BeaconStateApi {
    public constructor(config: IBeaconConfig, httpClient: HttpClient) {
        super(config, httpClient);
    }

    // TODO: changer mock with real data
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public getFork = async (stateId: "head"): Promise<Fork | null> => {
        try {
            const forkMock = {
                // eslint-disable-next-line camelcase,@typescript-eslint/camelcase
                previous_version: "0x00000001",
                // eslint-disable-next-line camelcase,@typescript-eslint/camelcase
                current_version: "0x00000001",
                epoch: "0",
            };
            return this.config.types.Fork.fromJson(forkMock, {case: "snake"});
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

            return this.config.types.ValidatorResponse.fromJson(
                {
                    index: indexValidatorResponse.index,
                    balance: stateValidatorResponse.effective_balance,
                    status: statusValidatorResponse.status,
                    validator: {
                        ...stateValidatorResponse,
                        pubkey: base64ToHex(stateValidatorResponse.public_key),
                        // eslint-disable-next-line camelcase,@typescript-eslint/camelcase
                        withdrawal_credentials: base64ToHex(stateValidatorResponse.withdrawal_credentials),
                    },
                },
                {
                    case: "snake",
                },
            ) as ICGValidatorResponse;
        } catch (e) {
            if (!e.message.includes('"code":404'))
                cgLogger.error("Failed to fetch validator", {validatorId: id, error: e.message});
            return null;
        }
    };

    // TODO: implement method "getLastEpoch"

    // TODO: implement method "getCommittees"
}
