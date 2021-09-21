import {CgEth2ApiClient} from "../module";
import {IBeaconConfig} from "@chainsafe/lodestar-config";
import {Dispatch} from "redux";
import {CgPrysmEth2EventsApi} from "./CgPrysmEth2EventsApi";

export class CgPrysmEth2Api extends CgEth2ApiClient {
    public constructor(
        config: IBeaconConfig,
        url: string,
        {publicKey, dispatch}: {publicKey?: string; dispatch?: Dispatch} = {},
    ) {
        super(config, url, {publicKey, dispatch});

        this.events = new CgPrysmEth2EventsApi(config, url);
    }
}
