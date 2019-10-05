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

export interface IWallet {
    getPrivateKey(): Buffer;
    getPrivateKeyString(): String;
    getPublicKey(): Buffer;
    getPublicKeyString(): String;
    getAddress(): Buffer;
    getAddressString(): String;
    getChecksumAddressString(): String;
    toV3(password: String, options?: Object): any;
    toV3String(password: String, options?: Object): String;
    getV3Filename(timeStamp: Number): String;
}

export interface IWalletService {
    generate(): IWallet;
    fromPrivateKey(privateKey: Buffer): IWallet;
    fromPublicKey(publicKey: Buffer): IWallet;
    fromExtendedPrivateKey(xPrivateKey: String): IWallet;
    fromExtendedPublicKey(xPublicKey: String): IWallet;
    fromV3(input: String, password: String, nonStrict: bool): IWallet;
}
