import { BeaconAPIClient } from './BeaconAPIClient';
import { measureExecution } from '../metrics/Metrics';
import { uint64, BLSPubkey, Epoch, ValidatorDuty, Slot, BeaconBlock, IndexedAttestation, Shard, uint8 } from '@chainsafe/eth2.0-types';
import { IBeaconApiClientOptions, ForkInformation, Syncing } from './interface';
import { Bucket } from '../db/schema';

export class BeaconAPIClientMetrics extends BeaconAPIClient {

    public constructor(options: IBeaconApiClientOptions) {
        super(options);
    }

    public async fetchNodeVersion(): Promise<string> {
        return measureExecution(this, super.fetchNodeVersion, "fetchNodeVersion", Bucket.beaconMetrics, null);
    }

    public async fetchGenesisTime(): Promise<uint64> {
        return measureExecution(this, super.fetchGenesisTime, "fetchGenesisTime", Bucket.beaconMetrics, null);
    }

    public async fetchNodeSyncing(): Promise<Syncing> {
        return measureExecution(this, super.fetchNodeSyncing, "fetchNodeSyncing", Bucket.beaconMetrics, null);
    }

    public async fetchForkInformation(): Promise<ForkInformation> {
        return measureExecution(
            this,
            super.fetchForkInformation,
            "fetchForkInformation",
            Bucket.beaconMetrics,
            null
        );
    }

    public async fetchValidatorDuties(validatorPubkeys: BLSPubkey[], epoch: Epoch): Promise<ValidatorDuty> {
        return measureExecution(
            this,
            super.fetchValidatorDuties,
            "fetchValidatorDuties",
            Bucket.beaconMetrics,
            validatorPubkeys,
            epoch
        );
    }

    public async fetchValidatorBlock(slot: Slot, randaoReveal: string): Promise<BeaconBlock> {
        return measureExecution(this, super.fetchValidatorBlock, "fetchValidatorBlock", Bucket.beaconMetrics, slot, randaoReveal);
    }

    public async publishSignedBlock(beaconBlock: BeaconBlock): Promise<any> {
        return measureExecution(this, super.publishSignedBlock, "publishSignedBlock", Bucket.beaconMetrics, beaconBlock);
    }

    public async produceAttestation(
        validatorPubkey: BLSPubkey,
        pocBit: uint8,
        slot: Slot,
        shard: Shard
    ): Promise<IndexedAttestation> {
        return measureExecution(
            this,
            super.produceAttestation,
            "produceAttestation",
            Bucket.beaconMetrics,
            validatorPubkey,
            pocBit,
            slot,
            shard
        );
    }

    public async publishSignedAttestation(attestation: IndexedAttestation): Promise<any> {
        return measureExecution(
            this,
            super.publishSignedAttestation,
            "publishSignedAttestation",
            Bucket.beaconMetrics,
            attestation
        );
    }

}