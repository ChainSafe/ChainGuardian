import {CgEth2ApiClient} from "../module";
import {IBeaconConfig} from "@chainsafe/lodestar-config";
import {Dispatch} from "redux";
import {CgPrysmEth2EventsApi} from "./CgPrysmEth2EventsApi";
import {CgPrysmEth2ValidatorApi} from "./CgPrysmEth2ValidatorApi";
import {CgPrysmEth2BeaconApi} from "./CgPrysmEth2BeaconApi";

export class CgPrysmEth2Api extends CgEth2ApiClient {
    public constructor(
        config: IBeaconConfig,
        url: string,
        {publicKey, dispatch}: {publicKey?: string; dispatch?: Dispatch} = {},
    ) {
        super(config, url, {publicKey, dispatch});

        this.beacon = new CgPrysmEth2BeaconApi(config, url);
        this.events = new CgPrysmEth2EventsApi(config, url);
        this.validator = new CgPrysmEth2ValidatorApi(config, url);
    }
}
