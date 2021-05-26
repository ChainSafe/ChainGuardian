import {CgEth2ApiClient} from "../module";
import {IEventsApi} from "@chainsafe/lodestar-validator/lib/api/interface/events";
import {IBeaconConfig} from "@chainsafe/lodestar-config";
import {Dispatch} from "redux";
import {CgNimbusEth2EventsApi} from "./cgNimbusEth2EventsApi";

export class CgNimbusEth2Api extends CgEth2ApiClient {
    public constructor(
        config: IBeaconConfig,
        url: string,
        {publicKey, dispatch}: {publicKey?: string; dispatch?: Dispatch} = {},
    ) {
        super(config, url);
        this.events = (new CgNimbusEth2EventsApi(config, url) as unknown) as IEventsApi;
    }
}
