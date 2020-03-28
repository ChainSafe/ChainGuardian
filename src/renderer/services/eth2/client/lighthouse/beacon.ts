import {IBeaconApi} from "@chainsafe/lodestar-validator/lib/api/interface/beacon";
import {bytes32, Fork, number64, SyncingStatus, uint64} from "@chainsafe/eth2.0-types";
import {HttpClient} from "../../../api";
import {IBeaconConfig} from "@chainsafe/eth2.0-config";
import {IBeaconClientOptions} from "../interface";
import {fromJson} from "@chainsafe/eth2.0-utils";

export enum LighthouseBeaconRoutes {
    VERSION = "/node/version",
    FORK = "/beacon/fork",
    GENESIS_TIME = "/beacon/genesis_time"
}

export class LighthouseBeaconApiClient implements IBeaconApi {

    private client: HttpClient;
    private config: IBeaconConfig;

    public constructor(options: IBeaconClientOptions) {
        this.client = new HttpClient(options.urlPrefix);
        this.config = options.config;
    }
    
    public async getClientVersion(): Promise<bytes32> {
        const response = await this.client.get<string>(LighthouseBeaconRoutes.VERSION);
        return Buffer.from(response, "utf8");
    }

    public async getFork(): Promise<{ fork: Fork; chainId: uint64 }> {
        const response = await this.client.get<JSON>(LighthouseBeaconRoutes.FORK);
        return {
            fork: fromJson<Fork>(this.config.types.Fork, response),
            chainId: BigInt(0)
        };
    }

    public getGenesisTime(): Promise<number64> {
        throw "not implemented";
    }

    public getSyncingStatus(): Promise<boolean | SyncingStatus> {
        throw "not implemented";
    }

}