import {HttpClient} from "../../../api";
import {IBeaconConfig} from "@chainsafe/lodestar-config";
import {DepositContract, ICGEth2Config} from "../interface";
import logger from "electron-log";
import {Fork} from "@chainsafe/lodestar-types";
import {Json} from "@chainsafe/ssz";

export class CgEth2Config implements ICGEth2Config {
    private readonly httpClient: HttpClient;
    private readonly config: IBeaconConfig;
    public constructor(config: IBeaconConfig, httpClient: HttpClient) {
        this.config = config;
        this.httpClient = httpClient;
    }

    public async getForkSchedule(): Promise<Fork[]> {
        const data = (await this.httpClient.get<{data: Json}>("/fork_schedule")).data as [];
        return data.map((fork) => this.config.types.Fork.fromJson(fork));
    }

    // TODO: implement ssz
    public getDepositContract = async (): Promise<DepositContract["data"]> => {
        try {
            const response = await this.httpClient.get<DepositContract>("/eth/v1/config/deposit_contract");
            return response.data;
        } catch (e) {
            logger.error("Failed to fetch deposit contract information", {error: e.message});
            return null;
        }
    };
}
