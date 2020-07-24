import {SyncingStatus} from "@chainsafe/lodestar-types";
import {HttpClient} from "../../../api";
import {IBeaconConfig} from "@chainsafe/lodestar-config";
import {IBeaconClientOptions, IEth2NodeApi} from "../interface";
import {LighthouseRoutes} from "./routes";
import {ILighthouseSyncResponse} from "./types";
import {ILogger} from "@chainsafe/lodestar-utils";
import {axiosConfig} from "./axios";


export class LighthouseNodeApiClient implements IEth2NodeApi {

    private client: HttpClient;
    private readonly config: IBeaconConfig;
    private readonly logger: ILogger;

    public constructor(options: IBeaconClientOptions) {
        this.client = new HttpClient(options.baseUrl, {
            axios: axiosConfig
        });
        this.config = options.config;
        this.logger = options.logger;
    }

    public async getSyncingStatus(): Promise<SyncingStatus> {
        const response = await this.client.get<ILighthouseSyncResponse>(LighthouseRoutes.GET_SYNC_STATUS);
        const syncDistance = BigInt(response.sync_status.highest_slot) - BigInt(response.sync_status.current_slot);
        return {
            headSlot: BigInt(response.sync_status.highest_slot),
            syncDistance: response.is_syncing ? BigInt(0) : syncDistance
        };
    }

    public async getVersion(): Promise<string> {
        return await this.client.get(LighthouseRoutes.GET_VERSION);
    }

}
