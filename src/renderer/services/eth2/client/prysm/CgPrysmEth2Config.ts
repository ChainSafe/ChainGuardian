import {HttpClient} from "../../../api";
import {IBeaconConfig} from "@chainsafe/lodestar-config";
import {DepositContract} from "../interface";
import logger from "electron-log";
import {base64ToHex} from "./utils";
import {CgEth2Config} from "../eth2ApiClient/cgEth2Config";

export class CgPrysmEth2Config extends CgEth2Config {
    public constructor(config: IBeaconConfig, httpClient: HttpClient) {
        super(config, httpClient);
    }

    // TODO: implement ssz
    public getDepositContract = async (): Promise<DepositContract["data"]> => {
        try {
            const response = await this.httpClient.get<DepositContract>("/eth/v1/config/deposit_contract");
            return {
                // eslint-disable-next-line camelcase,@typescript-eslint/camelcase
                chain_id: response.data.chain_id,
                address: base64ToHex(response.data.address),
            };
        } catch (e) {
            logger.error("Failed to fetch deposit contract information", {error: e.message});
            return null;
        }
    };
}
