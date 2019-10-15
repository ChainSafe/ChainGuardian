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
} from '@chainsafe/eth2.0-types';
import { Keypair } from '@chainsafe/bls/lib/keypair';

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
}

export interface IBeaconAPIClient {
    fetchNodeVersion(): Promise<string>;
    fetchGenesisTime(): Promise<uint64>;
    fetchNodeSyncing(): Promise<Syncing>;
    fetchForkInformation(): Promise<ForkInformation>;
    fetchValidatorDuties(validatorPubkeys: BLSPubkey[], epoch: Epoch): Promise<ValidatorDuty>;
    fetchValidatorBlock(slot: Slot, randaoReveal: string): Promise<BeaconBlock>;
    publishSignedBlock(beacon_block: BeaconBlock): Promise<any>;
    produceAttestation(
        validatorPubkey: BLSPubkey,
        pocBit: uint8,
        slot: Slot,
        shard: Shard
    ): Promise<IndexedAttestation>;
    publishSignedAttestation(attestation: IndexedAttestation): Promise<any>;
}

export interface ICGKeystoreConstructor {
    new (file: string): ICGKeystore;
}

export interface ICGKeystore {
    decrypt(password: string): Keypair;
    changePassword(oldPassword: string, newPassword: string): void;
    destroy(): void;
}
