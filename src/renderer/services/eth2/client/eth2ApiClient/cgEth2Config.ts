import {HttpClient} from "../../../api";
import {IBeaconConfig} from "@chainsafe/lodestar-config";
import {DepositContract, ICGEth2Config} from "../interface";
import logger from "electron-log";

export class CgEth2Config implements ICGEth2Config {
    private readonly httpClient: HttpClient;
    private readonly config: IBeaconConfig;
    public constructor(config: IBeaconConfig, httpClient: HttpClient) {
        this.config = config;
        this.httpClient = httpClient;
    }

    // TODO: implement ssz
    public getDepositContract = async (): Promise<DepositContract["data"]> => {
        try {
            const response = await this.httpClient.get<DepositContract>("/eth/v1/config/deposit_contract");
            return response.data;
        } catch (e) {
            logger.error("Failed to fetch deposit contract information", JSON.stringify({error: e.message}));
            return null;
        }
    };
}
