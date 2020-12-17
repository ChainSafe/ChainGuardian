import {ICGEth2BeaconApi} from "../interface";
import {
    IBeaconBlocksApi,
    IBeaconPoolApi,
    IBeaconStateApi,
} from "@chainsafe/lodestar-validator/lib/api/interface/beacon";
import {BeaconBlock, Genesis} from "@chainsafe/lodestar-types";
import {HttpClient} from "../../../api";
import {IBeaconConfig} from "@chainsafe/lodestar-config";
import {Json} from "@chainsafe/ssz";
import {CgEth2BeaconBlocksApi} from "./cgEth2BeaconBlocksApi";
import {CgEth2BeaconStateApi} from "./cgEth2BeaconStateApi";
import {CgEth2BeaconPoolApi} from "./cgEth2BeaconPoolApi";

export class CgEth2BeaconApi implements ICGEth2BeaconApi {
    public blocks: IBeaconBlocksApi;
    public state: IBeaconStateApi;
    public pool: IBeaconPoolApi;

    private readonly httpClient: HttpClient;
    private readonly config: IBeaconConfig;
    // TODO: implement logger;
    public constructor(config: IBeaconConfig, httpClient: HttpClient) {
        this.config = config;
        this.httpClient = httpClient;

        this.blocks = new CgEth2BeaconBlocksApi(config, httpClient);
        this.state = new CgEth2BeaconStateApi(config, httpClient);
        this.pool = new CgEth2BeaconPoolApi(config, httpClient);
    }

    public getGenesis = async (): Promise<Genesis | null> => {
        try {
            const genesisResponse = await this.httpClient.get<{data: Json}>("/eth/v1/beacon/genesis");
            return this.config.types.Genesis.fromJson(genesisResponse.data, {case: "snake"});
        } catch (e) {
            // TODO: implement logger;
            console.error("Failed to obtain genesis time", {error: e.message});
            return null;
        }
    };

    public getChainHead = async (): Promise<BeaconBlock> => {
        throw new Error("Method 'getChainHead' not implemented.");
    };
}
