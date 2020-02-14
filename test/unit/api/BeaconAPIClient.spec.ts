/* eslint-disable */
import {Eth2, IBeaconApiClientOptions} from "../../../src/renderer/services/api";
import { BeaconBlock, BLSPubkey, bytes48, IndexedAttestation, Slot } from '@chainsafe/eth2.0-types';
import axios from "axios";
import {
    FETCH_FORK_INFORMATION,
    FETCH_GENESIS_TIME,
    FETCH_NODE_VERSION,
    FETCH_VALIDATOR_BLOCK,
    FETCH_VALIDATOR_DUTIES,
    POLL_NODE_SYNCING,
    PRODUCE_ATTESTATION,
    PUBLISH_SIGNED_ATTESTATION,
    PUBLISH_SIGNED_BLOCK
} from "../../../src/renderer/constants/api";
import axiosMockAdapter from "axios-mock-adapter";
import { fromJson, toHex } from '@chainsafe/eth2.0-utils';
import {config} from "@chainsafe/eth2.0-config/lib/presets/minimal";

jest.setTimeout(10000);

// This sets the mock adapter on the default instance
const mock: axiosMockAdapter = new axiosMockAdapter(axios);
const API_URL = `https://${process.env.HOSTNAME || "localhost"}:${process.env.PORT || "3000"}`;

/**
 * ***********************************
 * Mocking variables for function calls
 * ***********************************
 */

const mockSyncing = {
    is_syncing: true,
    sync_status: {
        starting_block: "1",
        current_block: "2",
        highest_block: "3"
    }
};

const mockForkInformation = {
    chain_id: 1,
    fork: {
        previous_version: toHex(Buffer.alloc(4)),
        current_version: toHex(Buffer.alloc(4)),
        epoch: 3
    }
};

const mockValidatorKeys: BLSPubkey[] = [{} as bytes48];
const mockEpoch = 2;

const mockValidatorDuty = {
    validator_pubkey: "0x92fffcc44e690220c190be41378baf6152560eb13fa73bdf8b45120b56096acc4b4e87a0e0b97f83e48f0ff4990daa18",
    committee_index: 1,
    attestation_slot: 1,
    attestation_shard: 1,
    block_production_slot: 1
};

const mockSlot: Slot = 1;

const mockRandaoReveal = toHex(Buffer.alloc(96));

const mockBeaconBlock = {
    slot: 1,
    parent_root: toHex(Buffer.alloc(32)),
    state_root: toHex(Buffer.alloc(32)),
    body: {
        randao_reveal: toHex(Buffer.alloc(96)),
        eth1_data: {
            deposit_root: toHex(Buffer.alloc(32)),
            block_hash: toHex(Buffer.alloc(32)),
            deposit_count: 0,
        },
        graffiti: toHex(Buffer.alloc(32)),
        proposer_slashings: [],
        attester_slashings: [],
        attestations: [],
        deposits: [],
        voluntary_exits: [],
        transfers: [],
    },
    signature: toHex(Buffer.alloc(96))
};

const mockPocBit = 1;
const mockShard = 1;

/**
 * *******************
 * Mock axios requests
 * *******************
 */

mock.onGet(FETCH_NODE_VERSION).reply(200, "1");
mock.onGet(FETCH_GENESIS_TIME).reply(200, "2");
mock.onGet(POLL_NODE_SYNCING).reply(200, mockSyncing);
mock.onGet(FETCH_FORK_INFORMATION).reply(200, mockForkInformation);

const dutiesString = FETCH_VALIDATOR_DUTIES(mockValidatorKeys, mockEpoch);
mock.onGet(dutiesString).reply(200, mockValidatorDuty);

const dutiesStringWrong = FETCH_VALIDATOR_DUTIES(mockValidatorKeys, 100);
mock.onGet(dutiesStringWrong).reply(404);

const blockString = FETCH_VALIDATOR_BLOCK(mockSlot, mockRandaoReveal);
mock.onGet(blockString).reply(200, mockBeaconBlock);

mock.onPost(PUBLISH_SIGNED_BLOCK).reply(200, null);

const produceAttestationString = PRODUCE_ATTESTATION(mockValidatorKeys[0], mockPocBit, mockSlot, mockShard);
mock.onGet(produceAttestationString).reply(200, {} as IndexedAttestation);

mock.onPost(PUBLISH_SIGNED_ATTESTATION).reply(200, {});

/**
 * *************
 * Tests begins
 * *************
 */
describe("Beacon API client constructor", () => {
    it("should throw error when empty url is provided", async () => {
        expect(() => {
            new Eth2({} as IBeaconApiClientOptions);
        }).toThrow();
    });
});

describe("Beacon API client methods", () => {
    let client: Eth2;

    beforeEach(() => {
        client = new Eth2({
            urlPrefix: API_URL,
            config
        });
    });

    it("should return node version", async () => {
        const nodeVersion = await client.fetchNodeVersion();
        expect(nodeVersion.toString()).toBe("1");
    });

    it("should return genesis time", async () => {
        const genesisTime = await client.fetchGenesisTime();

        expect(genesisTime).toStrictEqual(BigInt(2));
    });

    it("should return node syncing status", async () => {
        const syncingStatus = await client.fetchNodeSyncing();

        expect(syncingStatus.isSyncing).toStrictEqual(mockSyncing.is_syncing);
        expect(syncingStatus.syncStatus.currentBlock).toEqual(BigInt(mockSyncing.sync_status.current_block));
    });

    it("should return fork information", async () => {
        const forkInformation = await client.fetchForkInformation();

        expect(forkInformation.chainId).toBe(mockForkInformation.chain_id);
        expect(toHex(forkInformation.fork.currentVersion)).toStrictEqual(mockForkInformation.fork.current_version);
    });

    it("should fetch validator duties", async () => {
        const responseValidatorDuty = await client.fetchValidatorDuties(mockValidatorKeys, mockEpoch);

        expect(toHex(responseValidatorDuty.validatorPubkey)).toBe(mockValidatorDuty.validator_pubkey);
        expect(client.fetchValidatorDuties(mockValidatorKeys, 100)).rejects.toEqual(new Error("404"));
    });

    it("should fetch validator block", async () => {
        const responseBeaconBlock = await client.fetchValidatorBlock(mockSlot, mockRandaoReveal);

        expect(toHex(responseBeaconBlock.body.graffiti)).toBe(mockBeaconBlock.body.graffiti);
    });


    it("should publish block", async () => {
        await client.publishSignedBlock(fromJson<BeaconBlock>(mockBeaconBlock, config.types.BeaconBlock));
    });
    //
    // it("should produce attestation", async () => {
    //     const response = await client.produceAttestation(mockValidatorKeys[0], mockPocBit, mockSlot, mockShard);
    //
    //     expect(response).toMatchObject({} as IndexedAttestation);
    // });
    //
    // it("should publish signed attestation", async () => {
    //     const response = await client.publishSignedAttestation({} as IndexedAttestation);
    //
    //     expect(response).toMatchObject({});
    // });
});
