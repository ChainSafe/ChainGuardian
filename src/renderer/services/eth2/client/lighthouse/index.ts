import {CgEth2ApiClient} from "../module";
import {CgEth2EventsApi} from "../eth2ApiClient/CgEth2EventsApi";
import {IChainForkConfig} from "@chainsafe/lodestar-config/lib/beaconConfig";
import {Dispatch} from "redux";

export class CgLighthouseEth2Api extends CgEth2ApiClient {
    public constructor(
        config: IChainForkConfig,
        url: string,
        {publicKey, dispatch}: {publicKey?: string; dispatch?: Dispatch} = {},
    ) {
        super(config, url, {publicKey, dispatch});

        this.events = new CgEth2EventsApi(config, url, true);
    }
}
