import {CgEth2BeaconStateApi} from "../eth2ApiClient/cgEth2BeaconStateApi";
import {IBeaconConfig} from "@chainsafe/lodestar-config";
import {HttpClient} from "../../../api";
import {BLSPubkey, ValidatorIndex} from "@chainsafe/lodestar-types";
import {ICGValidatorResponse} from "../interface";
import {cgLogger} from "../../../../../main/logger";
import {base64ToHex, hexToBase64} from "./utils";

export type ValidatorStatusResponse = {
    // eslint-disable-next-line camelcase
    public_key: string;
    // eslint-disable-next-line camelcase
    withdrawal_credentials: string;
    // eslint-disable-next-line camelcase
    effective_balance: string;
    // eslint-disable-next-line camelcase
    slashed: boolean;
    // eslint-disable-next-line camelcase
    activation_eligibility_epoch: string;
    // eslint-disable-next-line camelcase
    activation_epoch: string;
    // eslint-disable-next-line camelcase
    exit_epoch: string;
    // eslint-disable-next-line camelcase
    withdrawable_epoch: string;
};

type ValidatorStateResponse = {
    // eslint-disable-next-line camelcase
    status: string;
    // eslint-disable-next-line camelcase
    eth1_deposit_block_number: string;
    // eslint-disable-next-line camelcase
    deposit_inclusion_slot: string;
    // eslint-disable-next-line camelcase
    activation_epoch: string;
    // eslint-disable-next-line camelcase
    position_in_activation_queue: string;
};

export class CgPrysmEth2BeaconStateApi extends CgEth2BeaconStateApi {
    public constructor(config: IBeaconConfig, httpClient: HttpClient) {
        super(config, httpClient);
    }

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
}
