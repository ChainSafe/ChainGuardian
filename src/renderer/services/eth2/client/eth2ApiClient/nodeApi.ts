import {ICGEth2NodeApi} from "../interface";
import {HttpClient} from "../../../api";
import {IBeaconConfig} from "@chainsafe/lodestar-config";
import {SyncingStatus} from "@chainsafe/lodestar-types";

export class NodeApi implements ICGEth2NodeApi {
    private readonly httpClient: HttpClient;
    private readonly config: IBeaconConfig;
    public constructor(config: IBeaconConfig, httpClient: HttpClient) {
        this.config = config;
        this.httpClient = httpClient;
    }

    public getSyncingStatus = async (): Promise<SyncingStatus> => {
        console.log("getSyncingStatus");
        return undefined as SyncingStatus;
    };

    public getVersion = async (): Promise<string> => {
        console.log("getVersion");
        return undefined as string;
    };
}
