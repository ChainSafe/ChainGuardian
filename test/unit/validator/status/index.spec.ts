import sinon, {SinonStub, SinonStubbedInstance} from "sinon";
import {PrysmEth2ApiClient} from "../../../../src/renderer/services/eth2/client/prysm/prysm";
import {EthersNotifier} from "../../../../src/renderer/services/deposit/ethers";
import {getValidatorStatus, ValidatorStatus} from "../../../../src/renderer/services/validator/status";
import {PrysmBeaconApiClient} from "../../../../src/renderer/services/eth2/client/prysm/beacon";
import {PrysmValidatorApiClient} from "../../../../src/renderer/services/eth2/client/prysm/validator";
import {initBLS} from "@chainsafe/bls";
import {generateValidator} from "./util";
import {IBeaconConfig} from "@chainsafe/lodestar-config";
import {config} from "@chainsafe/lodestar-config/lib/presets/minimal";

interface IStubbedPrysmEth2ApiClient extends PrysmEth2ApiClient {
    beacon: SinonStubbedInstance<PrysmBeaconApiClient>,
    validator: SinonStubbedInstance<PrysmValidatorApiClient>
    getCurrentSlot: SinonStub,
    config: IBeaconConfig
}

describe("validator status", function() {

    let mockEth2Api: IStubbedPrysmEth2ApiClient;
    let mockEth1: SinonStubbedInstance<EthersNotifier>;
    
    const validatorKey = Buffer.from(
        "a3bdc0a0b11b10070e3d6ffe4d511577e611d8c12e07c48993422ab45d3c2de61fcdfe879b7492b1e44a73801ca78cfa",
        "hex"
    );
    
    beforeEach(async function() {
        await initBLS();
        mockEth2Api = sinon.createStubInstance(PrysmEth2ApiClient) as unknown as IStubbedPrysmEth2ApiClient;
        mockEth2Api.beacon = sinon.createStubInstance(PrysmBeaconApiClient);
        mockEth2Api.validator = sinon.createStubInstance(PrysmValidatorApiClient);
        mockEth2Api.beacon.getClientVersion.resolves();
        mockEth2Api.beacon.getGenesisTime.resolves(Date.now());
        mockEth2Api.config = config;
        mockEth1 = sinon.createStubInstance(EthersNotifier);
    });
    
    it("api is null", async function() {
        // @ts-ignore
        const status = await getValidatorStatus(validatorKey, null, null);
        expect(status).toEqual(ValidatorStatus.BEACON_ERROR);
    });
    
    it("api not working", async function() {
        mockEth2Api.beacon.getClientVersion.throws();
        const status = await getValidatorStatus(validatorKey, mockEth2Api, mockEth1);
        expect(status).toEqual(ValidatorStatus.BEACON_ERROR);
    });

    it("chain not started", async function() {
        mockEth2Api.beacon.getClientVersion.resolves();
        mockEth2Api.beacon.getGenesisTime.resolves(undefined);
        const status = await getValidatorStatus(validatorKey, mockEth2Api, mockEth1);
        expect(status).toEqual(ValidatorStatus.WAITING_START);
    });

    it("bn syncing", async function() {
        // @ts-ignore
        mockEth2Api.beacon.getSyncingStatus.resolves({});
        const status = await getValidatorStatus(validatorKey, mockEth2Api, mockEth1);
        expect(status).toEqual(ValidatorStatus.SYNCING);
    });

    it("waiting deposit", async function() {
        mockEth2Api.beacon.getSyncingStatus.resolves(false);
        mockEth2Api.beacon.getValidator.resolves(null);
        mockEth1.hasUserDeposited.resolves(false);
        const status = await getValidatorStatus(validatorKey, mockEth2Api, mockEth1);
        expect(status).toEqual(ValidatorStatus.WAITING_DEPOSIT);
    });

    it("deposited but not yet seen", async function() {
        mockEth2Api.beacon.getSyncingStatus.resolves(false);
        mockEth2Api.beacon.getValidator.resolves(null);
        mockEth1.hasUserDeposited.resolves(true);
        const status = await getValidatorStatus(validatorKey, mockEth2Api, mockEth1);
        expect(status).toEqual(ValidatorStatus.ACTIVATION_QUEUE);
    });

    it("in activation queue", async function() {
        mockEth2Api.beacon.getSyncingStatus.resolves(false);
        mockEth2Api.beacon.getValidator.resolves(generateValidator({activationEpoch: 1}));
        mockEth2Api.getCurrentSlot.returns(0);
        const status = await getValidatorStatus(validatorKey, mockEth2Api, mockEth1);
        expect(status).toEqual(ValidatorStatus.ACTIVATION_QUEUE);
    });

    it("slashed", async function() {
        mockEth2Api.beacon.getSyncingStatus.resolves(false);
        mockEth2Api.beacon.getValidator.resolves(generateValidator({activationEpoch: 0, slashed: true}));
        mockEth2Api.getCurrentSlot.returns(0);
        const status = await getValidatorStatus(validatorKey, mockEth2Api, mockEth1);
        expect(status).toEqual(ValidatorStatus.SLASHED);
    });

    it("exit queue", async function() {
        mockEth2Api.beacon.getSyncingStatus.resolves(false);
        mockEth2Api.beacon.getValidator.resolves(generateValidator({activationEpoch: 0, exitEpoch: 1}));
        mockEth2Api.getCurrentSlot.returns(0);
        const status = await getValidatorStatus(validatorKey, mockEth2Api, mockEth1);
        expect(status).toEqual(ValidatorStatus.EXIT_QUEUE);
    });

    it("exited", async function() {
        mockEth2Api.beacon.getSyncingStatus.resolves(false);
        mockEth2Api.beacon.getValidator.resolves(generateValidator({activationEpoch: 0, exitEpoch: 1}));
        mockEth2Api.getCurrentSlot.returns(config.params.SLOTS_PER_EPOCH * 2);
        const status = await getValidatorStatus(validatorKey, mockEth2Api, mockEth1);
        expect(status).toEqual(ValidatorStatus.EXITED);
    });

    it("active", async function() {
        mockEth2Api.beacon.getSyncingStatus.resolves(false);
        mockEth2Api.beacon.getValidator.resolves(generateValidator({activationEpoch: 0}));
        mockEth2Api.getCurrentSlot.returns(config.params.SLOTS_PER_EPOCH);
        const status = await getValidatorStatus(validatorKey, mockEth2Api, mockEth1);
        expect(status).toEqual(ValidatorStatus.ACTIVE);
    });
    
});