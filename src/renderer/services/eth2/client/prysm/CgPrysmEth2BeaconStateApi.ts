import {CgEth2BeaconStateApi} from "../eth2ApiClient/cgEth2BeaconStateApi";
import {IBeaconConfig} from "@chainsafe/lodestar-config";
import {HttpClient} from "../../../api";
import {BLSPubkey, ValidatorIndex} from "@chainsafe/lodestar-types";
import {ICGValidatorResponse} from "../interface";
import {Json} from "@chainsafe/ssz";
import {cgLogger} from "../../../../../main/logger";
import logger from "electron-log";

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
                    : `public_key=${Buffer.from(validatorId as number[]).toString("base64")}`;

            logger.warn(query);

            const url = `/eth/v1alpha1/validator?${query}`;

            console.warn(url);

            const stateValidatorResponse = await this.httpClient.get<{data: Json}>(url);

            logger.warn(stateValidatorResponse);

            return ({
                index: 1,
                balance: 1,
                status: 1,
                validator: 1,
            } as unknown) as ICGValidatorResponse;
        } catch (e) {
            if (!e.message.includes('"code":404'))
                cgLogger.error("Failed to fetch validator", {validatorId: id, error: e.message});
            return null;
        }
    };
}
