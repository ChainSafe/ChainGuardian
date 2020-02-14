import {
    BeaconBlock,
    BLSPubkey,
    Epoch,
    IndexedAttestation,
    Slot,
    uint64,
    uint8,
    ValidatorDuty
} from "@chainsafe/eth2.0-types";
import {IBeaconConfig} from "@chainsafe/eth2.0-config";
import {IChainFork, ISyncing} from "./types";

export interface IBeaconApiClientOptions {
    // Add more options if needed
    urlPrefix: string;
    config: IBeaconConfig;
}

export interface IBeaconAPIClient {
    fetchNodeVersion(): Promise<string>;
    fetchGenesisTime(): Promise<uint64>;
    fetchNodeSyncing(): Promise<ISyncing>;
    fetchForkInformation(): Promise<IChainFork>;
    fetchValidatorDuties(validatorPubkeys: BLSPubkey[], epoch: Epoch): Promise<ValidatorDuty>;
    fetchValidatorBlock(slot: Slot, randaoReveal: string): Promise<BeaconBlock>;
    publishSignedBlock(beaconBlock: BeaconBlock): Promise<void>;
    produceAttestation(
        validatorPubkey: BLSPubkey,
        pocBit: uint8,
        slot: Slot,
        shard: number
    ): Promise<IndexedAttestation>;
    publishSignedAttestation(attestation: IndexedAttestation): Promise<void>;
}
