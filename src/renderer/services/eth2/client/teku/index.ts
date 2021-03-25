import {CgEth2ApiClient} from "../module";
import {IBeaconConfig} from "@chainsafe/lodestar-config";
import {Dispatch} from "redux";
import {IEventsApi} from "@chainsafe/lodestar-validator/lib/api/interface/events";
import {CgTekuEth2EventsApi} from "./cgTekuEth2EventsApi";

export class CgTekuEth2Api extends CgEth2ApiClient {
    public constructor(
        config: IBeaconConfig,
        url: string,
        {publicKey, dispatch}: {publicKey?: string; dispatch?: Dispatch} = {},
    ) {
        super(config, url, {publicKey, dispatch});
        this.events = (new CgTekuEth2EventsApi(config, url) as unknown) as IEventsApi;
    }
}
