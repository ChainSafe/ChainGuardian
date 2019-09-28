import { BeaconAPIClient } from '../../src/renderer/services/BeaconAPIClient';
import {
    BLSPubkey,
    Epoch,
    ValidatorDuty,
    Slot,
    BeaconBlock,
    BeaconBlockBody,
    BLSSignature,
    bytes48,
    IndexedAttestation,
    Shard
} from '@chainsafe/eth2.0-types';
import axios from 'axios';
import {
    FETCH_NODE_VERSION,
    FETCH_GENESIS_TIME,
    POLL_NODE_SYNCING,
    FETCH_FORK_INFORMATION,
    FETCH_VALIDATOR_DUTIES,
    FETCH_VALIDATOR_BLOCK,
    PUBLISH_SIGNED_BLOCK,
    PRODUCE_ATTESTATION,
    PUBLISH_SIGNED_ATTESTATION
} from '../../src/renderer/constants/apiUrls';
import axiosMockAdapter from 'axios-mock-adapter';
import { DEFAULT_HOSTNAME, DEFAULT_PORT } from '../../src/renderer/constants/defaultConstants';
import { IBeaconApiClientOptions } from '../../src/renderer/services/interface';

jest.setTimeout(10000);

// This sets the mock adapter on the default instance
const mock: axiosMockAdapter = new axiosMockAdapter(axios);
const API_URL: string = `https://${process.env.HOSTNAME || DEFAULT_HOSTNAME}:${process.env.PORT || DEFAULT_PORT}`;

/**
 * ***********************************
 * Mocking variables for function calls
 * ***********************************
 */

const mockSyncing = {
    is_syncing: true,
    sync_status: {
        startingBlock: 1,
        currentBlock: 2,
        highestBlock: 3
    }
};

const mockForkInformation = {
    chain_id: 1,
    fork: {
        previousVersion: 1,
        currentVersion: 2,
        epoch: 3
    }
};

const mockValidatorKeys: BLSPubkey[] = [{} as bytes48];
const mockEpoch = 2;

const mockValidatorDuty: ValidatorDuty = {
    validatorPubkey: {} as bytes48,
    committeeIndex: 1,
    attestationSlot: 1,
    attestationShard: 1,
    blockProductionSlot: 1
};

const mockSlot: Slot = 1;

const mockRandaoReveal: string = '1';

const mockBeaconBlock: BeaconBlock = {
    slot: 1,
    parentRoot: {} as bytes48,
    stateRoot: {} as bytes48,
    body: {} as BeaconBlockBody,
    signature: {} as BLSSignature
};

const mockPocBit = 1;
const mockShard: Shard = 1;

/**
 * *******************
 * Mock axios requests
 * *******************
 */

mock.onGet(FETCH_NODE_VERSION).reply(200, '1');
mock.onGet(FETCH_GENESIS_TIME).reply(200, 2);
mock.onGet(POLL_NODE_SYNCING).reply(200, mockSyncing);
mock.onGet(FETCH_FORK_INFORMATION).reply(200, mockForkInformation);

const dutiesString = FETCH_VALIDATOR_DUTIES(mockValidatorKeys, mockEpoch);
mock.onGet(dutiesString).reply(200, mockValidatorDuty);

const dutiesStringWrong = FETCH_VALIDATOR_DUTIES(mockValidatorKeys, 100);
mock.onGet(dutiesStringWrong).reply(404);

const blockString = FETCH_VALIDATOR_BLOCK(mockSlot, mockRandaoReveal);
mock.onGet(blockString).reply(200, mockBeaconBlock);

mock.onPost(PUBLISH_SIGNED_BLOCK, mockBeaconBlock).reply(200, {});

const produceAttestationString = PRODUCE_ATTESTATION(mockValidatorKeys[0], mockPocBit, mockSlot, mockShard);
mock.onGet(produceAttestationString).reply(200, {} as IndexedAttestation);

mock.onPost(PUBLISH_SIGNED_ATTESTATION).reply(200, {});

/**
 * *************
 * Tests begins
 * *************
 */
describe('Beacon API client constructor', () => {
    it('should throw error when empty url is provided', async () => {
        expect(() => {
            new BeaconAPIClient({} as IBeaconApiClientOptions);
        }).toThrow();
    });
});

describe('Beacon API client methods', () => {
    let client: BeaconAPIClient;

    beforeEach(() => {
        client = new BeaconAPIClient({
            urlPrefix: API_URL
        });
    });

    it('should return node version', async () => {
        const nodeVersion = await client.fetchNodeVersion();
        expect(nodeVersion.toString()).toBe('1');
    });

    it('should return genesis time', async () => {
        const genesisTime = await client.fetchGenesisTime();

        expect(genesisTime).toBe(2);
    });

    it('should return node syncing status', async () => {
        const syncingStatus = await client.fetchNodeSyncing();

        expect(syncingStatus).toMatchObject(mockSyncing);
    });

    it('should return fork information', async () => {
        const forkInformation = await client.fetchForkInformation();

        expect(forkInformation).toMatchObject(mockForkInformation);
    });

    it('should fetch validator duties', async () => {
        const responseValidatorDuty = await client.fetchValidatorDuties(mockValidatorKeys, mockEpoch);
        const responseValidatorDutyWrong = await client.fetchValidatorDuties(mockValidatorKeys, 99);

        expect(responseValidatorDuty).toMatchObject(mockValidatorDuty);
        expect(responseValidatorDutyWrong).not.toMatchObject(mockValidatorDuty);
        expect(responseValidatorDutyWrong).toMatchObject(new Error('404'));
    });

    it('should fetch validator block', async () => {
        const responseBeaconBlock = await client.fetchValidatorBlock(mockSlot, mockRandaoReveal);

        expect(responseBeaconBlock).toMatchObject(mockBeaconBlock);
    });

    it('should publish block', async () => {
        const response = await client.publishSignedBlock(mockBeaconBlock);

        expect(response).toMatchObject({});
    });

    it('should produce attestation', async () => {
        const response = await client.produceAttestation(mockValidatorKeys[0], mockPocBit, mockSlot, mockShard);

        expect(response).toMatchObject({} as IndexedAttestation);
    });

    it('should publish signed attestation', async () => {
        const response = await client.publishSignedAttestation({} as IndexedAttestation);

        expect(response).toMatchObject({});
    });
});
