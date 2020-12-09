import {ICGEth2BeaconApi, ICGEth2BeaconApiState} from "../interface";
import {IBeaconBlocksApi, IBeaconPoolApi} from "@chainsafe/lodestar-validator/lib/api/interface/beacon";
import {BeaconBlock, BeaconState, Genesis} from "@chainsafe/lodestar-types";
import {HttpClient} from "../../../api";
import {IBeaconConfig} from "@chainsafe/lodestar-config";
import {Json} from "@chainsafe/ssz";
import {BeaconBlocks} from "./beaconBlocks";
import {BeaconState as BeaconStateApi} from "./beaconState";
import {BeaconPool} from "./beaconPool";

export class Beacon implements ICGEth2BeaconApi {
    public blocks: IBeaconBlocksApi;
    public state: ICGEth2BeaconApiState;
    public pool: IBeaconPoolApi;

    private readonly httpClient: HttpClient;
    private readonly config: IBeaconConfig;
    // TODO: implement logger;
    public constructor(config: IBeaconConfig, httpClient: HttpClient) {
        this.config = config;
        this.httpClient = httpClient;

        this.blocks = new BeaconBlocks(config, httpClient);
        this.state = new BeaconStateApi(config, httpClient);
        this.pool = new BeaconPool(config, httpClient);
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

    public getBeaconState = async (): Promise<BeaconState> => {
        throw new Error("Method 'getBeaconState' not implemented.");
    };
}
