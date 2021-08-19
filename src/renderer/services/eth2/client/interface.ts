import {Api as BeaconApi} from "@chainsafe/lodestar-api/lib/routes/beacon";
import {Api as ConfigApi} from "@chainsafe/lodestar-api/lib/routes/config";
import {Api as DebugApi} from "@chainsafe/lodestar-api/lib/routes/debug";
import {Api as EventsApi} from "@chainsafe/lodestar-api/lib/routes/events";
import {Api as NodeApi} from "@chainsafe/lodestar-api/lib/routes/node";
import {Api as ValidatorApi} from "@chainsafe/lodestar-api/lib/routes/validator";
import {Api as LodestarApi} from "@chainsafe/lodestar-api/lib/routes/lodestar";
import {Api as LightclientApi} from "@chainsafe/lodestar-api/lib/routes/lightclient";

export type CgBeaconApi = BeaconApi & {getPoolStatus(): Promise<PoolStatus>};
export type CgConfigApi = ConfigApi;
export type CgDebugApi = DebugApi;
export type CgEventsApi = EventsApi;
export type CgNodeApi = NodeApi;
export type CgValidatorApi = ValidatorApi;
export type CgLodestarApi = LodestarApi;
export type CgLightclientApi = LightclientApi;

export type Eth2Api = {
    beacon: CgBeaconApi;
    config: CgConfigApi;
    debug: CgDebugApi;
    events: CgEventsApi;
    node: CgNodeApi;
    validator: CgValidatorApi;
    //
    lightclient: CgLightclientApi;
    lodestar: CgLodestarApi;
};

export type PoolStatus = {
    attestations: number;
    attesterSlashings: number;
    voluntaryExits: number;
    proposerSlashings: number;
};
