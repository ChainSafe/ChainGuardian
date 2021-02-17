import {
    ICGEth2BeaconApi,
    ICGEth2NodeApi,
    ICGEth2ValidatorApi,
    ICgEth2ApiClient,
    ICGEth2Config,
} from "../../../../../src/renderer/services/eth2/client/interface";
import {IBeaconConfig} from "@chainsafe/lodestar-config";
import sinon, {SinonStubbedInstance} from "sinon";
import EventEmitter from "events";
import {IEventsApi} from "@chainsafe/lodestar-validator/lib/api/interface/events";
import {IBeaconClock} from "@chainsafe/lodestar-validator";
import {Root} from "@chainsafe/lodestar-types";

export class MockEth2ApiClient extends EventEmitter implements ICgEth2ApiClient {
    public config: IBeaconConfig;
    public url: string;
    public beacon: SinonStubbedInstance<ICGEth2BeaconApi>;
    public node: SinonStubbedInstance<ICGEth2NodeApi>;
    public validator: SinonStubbedInstance<ICGEth2ValidatorApi>;
    public events: SinonStubbedInstance<IEventsApi>;
    public clock: SinonStubbedInstance<IBeaconClock>;
    public configApi: SinonStubbedInstance<ICGEth2Config>;
    public genesisValidatorsRoot: Root = Buffer.alloc(32, 0);
    public connect = sinon.stub();
    public disconnect = sinon.stub();
    public getCurrentSlot = sinon.stub();
    public getVersion = sinon.stub();
    //todo refactor this to emit based on this.on()
    public onNewChainHead = sinon.stub();
    public onNewEpoch = sinon.stub();
    public onNewSlot = sinon.stub();

    public constructor(config: IBeaconConfig) {
        super();
        this.config = config;
        // this.beacon = sinon.createStubInstance(LighthouseBeaconApiClient);
        // this.node = sinon.createStubInstance(LighthouseNodeApiClient);
        // this.validator = sinon.createStubInstance(LighthouseValidatorApiClient);
    }
}
