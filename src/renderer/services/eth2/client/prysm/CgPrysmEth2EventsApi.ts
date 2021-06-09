import {CgEth2EventsApi} from "../eth2ApiClient/cgEth2EventsApi";
import {IBeaconConfig} from "@chainsafe/lodestar-config";

export class CgPrysmEth2EventsApi extends CgEth2EventsApi {
    public constructor(config: IBeaconConfig, baseUrl: string) {
        super(config, baseUrl);
    }
}
