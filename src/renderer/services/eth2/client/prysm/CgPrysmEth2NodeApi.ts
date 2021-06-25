import {CgEth2NodeApi} from "../eth2ApiClient/cgEth2NodeApi";
import {IBeaconConfig} from "@chainsafe/lodestar-config";
import {HttpClient} from "../../../api";
import {SyncingStatus} from "@chainsafe/lodestar-types";
import {Json} from "@chainsafe/ssz";

export class CgPrysmEth2NodeApi extends CgEth2NodeApi {
    public constructor(config: IBeaconConfig, httpClient: HttpClient) {
        super(config, httpClient);
    }

    // TODO: this need to be implemented
    public getSyncingStatus = async (): Promise<SyncingStatus> => {
        const syncingResponse = await this.httpClient.get<{data: Json}>("/eth/v1alpha1/node/syncing");
        this.httpClient.get("/eth/v1alpha1/beacon/chainhead").then(console.log);
        return this.config.types.SyncingStatus.fromJson(syncingResponse.data, {case: "snake"});
    };

    public getVersion = async (): Promise<string> => {
        const versionResponse = await this.httpClient.get<{version: string}>("/eth/v1alpha1/node/version");
        return versionResponse.version;
    };
}
