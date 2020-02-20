import {IBeaconApi} from "@chainsafe/lodestar-validator/lib/api/interface/beacon";
import {bytes32, Fork, number64, SyncingStatus, uint64} from "@chainsafe/eth2.0-types";
import {IBeaconClientOptions} from "../interface";
import {IBeaconConfig} from "@chainsafe/eth2.0-config";
import {HttpClient} from "../../../api";
import {computeEpochAtSlot, getCurrentSlot} from "@chainsafe/lodestar-validator/lib/util";

export class PrysmBeaconApiClient implements IBeaconApi {

    private client: HttpClient;
    private config: IBeaconConfig;
    
    public constructor(options: IBeaconClientOptions) {
        this.client = new HttpClient(options.urlPrefix);
        this.config = options.config;
    }
    
    public async getClientVersion(): Promise<bytes32> {
        const response = await this.client.get<{version: string, metadata: string}>("/node/version");
        return Buffer.from(response.version, "ascii");
    }

    public async getFork(): Promise<{ fork: Fork; chainId: uint64 }> {
        //TODO; move when epoch param is introduced
        const epoch = computeEpochAtSlot(this.config, getCurrentSlot(this.config, await this.getGenesisTime()));
        const response = await this.client.get<{signatureDomain: string}>(
            "/validator/domain",
            {params: {epoch, domain: "00000000"}}
        );
        //first 4 bytes are domain type
        const version = Buffer.from(response.signatureDomain, "hex").slice(4, 8);
        return {
            fork: {
                currentVersion: version,
                previousVersion: version,
                epoch
            },
            chainId: 0n
        };
    }

    public async getGenesisTime(): Promise<number64> {
        const response = await this.client.get<{genesisTime: string}>("/node/genesis");
        return Math.floor(Date.parse(response.genesisTime) / 1000);
    }

    public async getSyncingStatus(): Promise<boolean | SyncingStatus> {
        const response = await this.client.get<{syncing: boolean}>("/node/syncing");
        return response.syncing;
    }

}