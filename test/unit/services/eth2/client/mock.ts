import {SinonStubbedInstance} from "sinon";
import EventEmitter from "events";
import {CgEth2ApiClient} from "../../../../../src/renderer/services/eth2/client/eth2ApiClient";
import {
    CgBeaconApi,
    CgConfigApi,
    CgDebugApi,
    CgEventsApi,
    CgLightclientApi,
    CgLodestarApi,
    CgNodeApi,
    CgValidatorApi,
} from "../../../../../src/renderer/services/eth2/client/interface";

export class MockEth2ApiClient extends EventEmitter implements CgEth2ApiClient {
    public beacon: SinonStubbedInstance<CgBeaconApi>;
    public config: SinonStubbedInstance<CgConfigApi>;
    public debug: SinonStubbedInstance<CgDebugApi>;
    public events: SinonStubbedInstance<CgEventsApi>;
    public node: SinonStubbedInstance<CgNodeApi>;
    public validator: SinonStubbedInstance<CgValidatorApi>;
    public lightclient: SinonStubbedInstance<CgLightclientApi>;
    public lodestar: SinonStubbedInstance<CgLodestarApi>;
}
