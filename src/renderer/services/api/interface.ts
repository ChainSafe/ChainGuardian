/* eslint-disable */
import {
    bool,
    SyncingStatus,
    uint64,
    Fork,
    BLSPubkey,
    Epoch,
    ValidatorDuty,
    Slot,
    BeaconBlock,
    uint8,
    Shard,
    IndexedAttestation
} from "@chainsafe/eth2.0-types";

export interface Syncing {
    is_syncing: bool;
    sync_status: SyncingStatus;
}

export interface ForkInformation {
    chain_id: uint64;
    fork: Fork;
}

export interface IBeaconApiClientOptions {
    // Add more options if needed
    urlPrefix: string;
    instanceId: string;
}

export interface IBeaconAPIClient {
    instanceId: string;
    fetchNodeVersion(): Promise<string>;
    fetchGenesisTime(): Promise<uint64>;
    fetchNodeSyncing(): Promise<Syncing>;
    fetchForkInformation(): Promise<ForkInformation>;
    fetchValidatorDuties(validatorPubkeys: BLSPubkey[], epoch: Epoch): Promise<ValidatorDuty>;
    fetchValidatorBlock(slot: Slot, randaoReveal: string): Promise<BeaconBlock>;
    publishSignedBlock(beaconBlock: BeaconBlock): Promise<any>;
    produceAttestation(
        validatorPubkey: BLSPubkey,
        pocBit: uint8,
        slot: Slot,
        shard: Shard
    ): Promise<IndexedAttestation>;
    publishSignedAttestation(attestation: IndexedAttestation): Promise<any>;
}
