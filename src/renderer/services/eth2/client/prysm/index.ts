import {CgEth2ApiClient} from "../module";
import {IBeaconConfig} from "@chainsafe/lodestar-config";
import {Dispatch} from "redux";
import {CgPrysmEth2BeaconApi} from "./CgPrysmEth2BeaconApi";
import {CgPrysmEth2ValidatorApi} from "./CgPrysmEth2ValidatorApi";

export class CgPrysmEth2Api extends CgEth2ApiClient {
    public constructor(
        config: IBeaconConfig,
        url: string,
        {publicKey, dispatch}: {publicKey?: string; dispatch?: Dispatch} = {},
    ) {
        super(config, url, {publicKey, dispatch});

        this.validator = new CgPrysmEth2ValidatorApi(config, this.httpClient);
        this.beacon = new CgPrysmEth2BeaconApi(config, this.httpClient, publicKey, dispatch);
    }
}
