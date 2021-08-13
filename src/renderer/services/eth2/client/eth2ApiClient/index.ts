import {Eth2Api} from "../interface";
import {Api as BeaconApi} from "@chainsafe/lodestar-api/lib/routes/beacon";
import {Api as ConfigApi} from "@chainsafe/lodestar-api/lib/routes/config";
import {Api as DebugApi} from "@chainsafe/lodestar-api/lib/routes/debug";
import {Api as EventsApi} from "@chainsafe/lodestar-api/lib/routes/events";
import {Api as NodeApi} from "@chainsafe/lodestar-api/lib/routes/node";
import {Api as ValidatorApi} from "@chainsafe/lodestar-api/lib/routes/validator";
import {Api as LightclientApi} from "@chainsafe/lodestar-api/lib/routes/lightclient";
import {Api as LodestarApi} from "@chainsafe/lodestar-api/lib/routes/lodestar";
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

export class CgEth2ApiClient implements Eth2Api {
    public beacon: BeaconApi;
    public config: ConfigApi;
    public debug: DebugApi;
    public events: EventsApi;
    public node: NodeApi;
    public validator: ValidatorApi;
    public lightclient: LightclientApi;
    public lodestar: LodestarApi;

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
}
