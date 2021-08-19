import {
    CgBeaconApi,
    Eth2Api,
    CgConfigApi,
    CgDebugApi,
    CgEventsApi,
    CgNodeApi,
    CgValidatorApi,
    CgLodestarApi,
    CgLightclientApi,
} from "../interface";
import {Dispatch} from "redux";
import {CgEth2BeaconApi} from "./CgEth2BeaconApi";
import {CgEth2ConfigApi} from "./CgEth2ConfigApi";
import {CgEth2DebugApi} from "./CgEth2DebugApi";
import {CgEth2NodeApi} from "./CgEth2NodeApi";
import {CgEth2ValidatorApi} from "./CgEth2ValidatorApi";
import {CgEth2EventsApi} from "./CgEth2EventsApi";
import {CgEth2LightclientApi} from "./CgEth2LightclientApi";
import {CgEth2LodestarApi} from "./CgEth2LodestarApi";
import {IChainForkConfig} from "@chainsafe/lodestar-config/lib/beaconConfig";
import axios from "axios";
import {getNetworkConfigByGenesisVersion} from "../../networks";

export class CgEth2ApiClient implements Eth2Api {
    public beacon: CgBeaconApi;
    public config: CgConfigApi;
    public debug: CgDebugApi;
    public events: CgEventsApi;
    public node: CgNodeApi;
    public validator: CgValidatorApi;
    public lightclient: CgLightclientApi;
    public lodestar: CgLodestarApi;

    public constructor(
        config: IChainForkConfig,
        url: string,
        {publicKey, dispatch}: {publicKey?: string; dispatch?: Dispatch} = {},
    ) {
        this.beacon = new CgEth2BeaconApi(config, url, {publicKey, dispatch});
        this.config = new CgEth2ConfigApi(config, url);
        this.debug = new CgEth2DebugApi(config, url);
        this.events = new CgEth2EventsApi(config, url);
        this.node = new CgEth2NodeApi(config, url);
        this.validator = new CgEth2ValidatorApi(config, url);

        // TODO: checkout what to do with non standard api?
        this.lightclient = new CgEth2LightclientApi(config, url);
        this.lodestar = new CgEth2LodestarApi(config, url);
    }

    public static getBeaconURLNetworkName = async (url: string): Promise<string> => {
        try {
            // eslint-disable-next-line camelcase
            const response = await axios.get<{data: {genesis_fork_version: string}}>(`/eth/v1/beacon/genesis`, {
                baseURL: url,
                timeout: 1000,
            });
            const network = await getNetworkConfigByGenesisVersion(response.data.data.genesis_fork_version);
            if (!network) {
                throw new Error("Beacon chain network not supported");
            }
            return network.networkName;
        } catch (e) {
            throw new Error("Beacon chain not found");
        }
    };
}
