import {Api as BeaconApi} from "@chainsafe/lodestar-api/lib/routes/beacon";
import {Api as ConfigApi} from "@chainsafe/lodestar-api/lib/routes/config";
import {Api as DebugApi} from "@chainsafe/lodestar-api/lib/routes/debug";
import {Api as EventsApi} from "@chainsafe/lodestar-api/lib/routes/events";
import {Api as NodeApi} from "@chainsafe/lodestar-api/lib/routes/node";
import {Api as ValidatorApi} from "@chainsafe/lodestar-api/lib/routes/validator";
import {Api as LodestarApi} from "@chainsafe/lodestar-api/lib/routes/lodestar";
import {Api as LightclientApi} from "@chainsafe/lodestar-api/lib/routes/lightclient";

export type Eth2Api = {
    beacon: BeaconApi;
    config: ConfigApi;
    debug: DebugApi;
    events: EventsApi;
    node: NodeApi;
    validator: ValidatorApi;
    //
    lightclient: LightclientApi;
    lodestar: LodestarApi;
};
