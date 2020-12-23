import {HttpClient} from "../../../api";
import {IBeaconConfig} from "@chainsafe/lodestar-config";
import {IDepositContract, ICGEth2Config} from "../interface";

export class CgEth2Config implements ICGEth2Config {
    private readonly httpClient: HttpClient;
    private readonly config: IBeaconConfig;
    public constructor(config: IBeaconConfig, httpClient: HttpClient) {
        this.config = config;
        this.httpClient = httpClient;
    }

    // TODO: implement ssz
    public getDepositContract = async (): Promise<IDepositContract["data"]> => {
        try {
            const response = await this.httpClient.get<IDepositContract>("/eth/v1/config/deposit_contract");
            return response.data;
        } catch (e) {
            // TODO: implement logger;
            console.error("Failed to fetch deposit contract information", e.message);
            return null;
        }
    };
}
