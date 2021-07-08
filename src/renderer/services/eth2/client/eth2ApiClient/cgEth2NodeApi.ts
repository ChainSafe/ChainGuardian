import {ICGEth2NodeApi, PeerCount, PeerCountResult} from "../interface";
import {HttpClient} from "../../../api";
import {IBeaconConfig} from "@chainsafe/lodestar-config";
import {SyncingStatus} from "@chainsafe/lodestar-types";
import {Json} from "@chainsafe/ssz";

export class CgEth2NodeApi implements ICGEth2NodeApi {
    protected readonly httpClient: HttpClient;
    protected readonly config: IBeaconConfig;
    public constructor(config: IBeaconConfig, httpClient: HttpClient) {
        this.config = config;
        this.httpClient = httpClient;
    }

    public getSyncingStatus = async (): Promise<SyncingStatus> => {
        const syncingResponse = await this.httpClient.get<{data: Json}>("/eth/v1/node/syncing");
        return this.config.types.SyncingStatus.fromJson(syncingResponse.data, {case: "snake"});
    };

    public getVersion = async (): Promise<string> => {
        const versionResponse = await this.httpClient.get<{data: {version: string}}>("/eth/v1/node/version");
        return versionResponse.data.version;
    };

    public getPeerCount = async (): Promise<PeerCount> => {
        const peerCount = await this.httpClient.get<{data: PeerCountResult}>("/eth/v1/node/peer_count");
        return {
            disconnected: Number(peerCount.data.disconnected),
            connecting: Number(peerCount.data.connecting),
            connected: Number(peerCount.data.connected),
            disconnecting: Number(peerCount.data.disconnecting),
        };
    };
}
