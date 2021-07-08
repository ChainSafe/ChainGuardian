import {CgEth2ApiClient} from "../module";
import {IEventsApi} from "@chainsafe/lodestar-validator/lib/api/interface/events";
import {IBeaconConfig} from "@chainsafe/lodestar-config";
import {Dispatch} from "redux";
import {CgNimbusEth2EventsApi} from "./cgNimbusEth2EventsApi";
import {CgNimbusEth2ValidatorApi} from "./cgNimbusEth2ValidatorApi";

export class CgNimbusEth2Api extends CgEth2ApiClient {
    public constructor(
        config: IBeaconConfig,
        url: string,
        {publicKey, dispatch}: {publicKey?: string; dispatch?: Dispatch} = {},
    ) {
        super(config, url, {publicKey, dispatch});

        this.validator = new CgNimbusEth2ValidatorApi(config, this.httpClient);
        this.events = (new CgNimbusEth2EventsApi(config, url) as unknown) as IEventsApi;
    }
}
