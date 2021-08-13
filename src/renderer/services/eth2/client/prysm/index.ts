import {CgEth2ApiClient} from "../module";
import {IBeaconConfig} from "@chainsafe/lodestar-config";
import {Dispatch} from "redux";

// TODO: implement prysm again -.-
// note to myself - check git history for previous version
export class CgPrysmEth2Api extends CgEth2ApiClient {
    public constructor(
        config: IBeaconConfig,
        url: string,
        {publicKey, dispatch}: {publicKey?: string; dispatch?: Dispatch} = {},
    ) {
        super(config, url, {publicKey, dispatch});

        throw new Error("NOT IMPLEMENTED!");
    }
}
