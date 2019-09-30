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
    fetchNodeVersion(): Promise<string | Error>;
    fetchGenesisTime(): Promise<uint64 | Error>;
    fetchNodeSyncing(): Promise<Syncing | Error>;
    fetchForkInformation(): Promise<ForkInformation | Error>;
    fetchValidatorDuties(validatorPubkeys: BLSPubkey[], epoch: Epoch): Promise<ValidatorDuty | Error>;
    fetchValidatorBlock(slot: Slot, randaoReveal: string): Promise<BeaconBlock | Error>;
    publishSignedBlock(beacon_block: BeaconBlock): Promise<any | Error>;
    produceAttestation(
        validatorPubkey: BLSPubkey,
        pocBit: uint8,
        slot: Slot,
        shard: Shard
    ): Promise<IndexedAttestation | Error>;
    publishSignedAttestation(attestation: IndexedAttestation): Promise<any | Error>;
}
