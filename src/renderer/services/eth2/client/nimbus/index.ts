import {CgEth2ApiClient} from "../module";
import {IChainForkConfig} from "@chainsafe/lodestar-config/lib/beaconConfig";
import {Dispatch} from "redux";
import {CgNimbusEth2EventsApi} from "./CgNimbusEth2EventsApi";
import {CgNimbusEth2ValidatorApi} from "./CgNimbusEth2ValidatorApi";

// TODO: check if works with nimbus latest version?
export class CgNimbusEth2Api extends CgEth2ApiClient {
    public constructor(
        config: IChainForkConfig,
        url: string,
        {publicKey, dispatch}: {publicKey?: string; dispatch?: Dispatch} = {},
    ) {
        super(config, url, {publicKey, dispatch});

        this.events = new CgNimbusEth2EventsApi(config, url, true);
        this.validator = new CgNimbusEth2ValidatorApi(config, url);
    }
}
