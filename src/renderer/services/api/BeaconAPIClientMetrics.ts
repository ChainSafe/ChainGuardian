import {BeaconAPIClient} from "./BeaconAPIClient";
import {measureExecution} from "../metrics/Metrics";
import {
    uint64,
    BLSPubkey,
    Epoch,
    ValidatorDuty,
    Slot,
    BeaconBlock,
    IndexedAttestation,
    Shard,
    uint8
} from "@chainsafe/eth2.0-types";
import {IBeaconApiClientOptions, ForkInformation, Syncing} from "./interface";
import {Bucket} from "../db/schema";

export class BeaconAPIClientMetrics extends BeaconAPIClient {

    public constructor(options: IBeaconApiClientOptions) {
        super(options);
    }

    public async fetchNodeVersion(): Promise<string> {
        return measureExecution(this,
            {
                function: super.fetchNodeVersion,
                functionName: "fetchNodeVersion",
                instanceId: this.instanceId,
                bucket: Bucket.beaconMetrics
            },
            Bucket.beaconMetrics, null);
    }

    public async fetchGenesisTime(): Promise<uint64> {
        return measureExecution(this, 
            {
                function: super.fetchGenesisTime,
                functionName: "fetchGenesisTime",
                instanceId: this.instanceId,
                bucket: Bucket.beaconMetrics
            },
            Bucket.beaconMetrics, null);
    }

    public async fetchNodeSyncing(): Promise<Syncing> {
        return measureExecution(this,
            {
                function: super.fetchNodeSyncing,
                functionName: "fetchNodeSyncing",
                instanceId: this.instanceId,
                bucket: Bucket.beaconMetrics
            },
            Bucket.beaconMetrics, null);
    }

    public async fetchForkInformation(): Promise<ForkInformation> {
        return measureExecution(
            this,
            {
                function: super.fetchForkInformation,
                functionName: "fetchForkInformation",
                instanceId: this.instanceId,
                bucket: Bucket.beaconMetrics
            },
            Bucket.beaconMetrics,
            null
        );
    }

    public async fetchValidatorDuties(validatorPubkeys: BLSPubkey[], epoch: Epoch): Promise<ValidatorDuty> {
        return measureExecution(
            this,
            {
                function: super.fetchValidatorDuties,
                functionName: "fetchValidatorDuties",
                instanceId: this.instanceId,
                bucket: Bucket.beaconMetrics
            },
            Bucket.beaconMetrics,
            validatorPubkeys,
            epoch
        );
    }

    public async fetchValidatorBlock(slot: Slot, randaoReveal: string): Promise<BeaconBlock> {
        return measureExecution(this,
            {
                function: super.fetchValidatorBlock,
                functionName: "fetchValidatorBlock",
                instanceId: this.instanceId,
                bucket: Bucket.beaconMetrics
            },
            slot, randaoReveal);
    }

    public async publishSignedBlock(beaconBlock: BeaconBlock): Promise<any> {
        return measureExecution(
            this,
            {
                function: super.publishSignedBlock,
                functionName: "publishSignedBlock",
                instanceId: this.instanceId,
                bucket: Bucket.beaconMetrics
            },
            beaconBlock
        );
    }

    public async produceAttestation(
        validatorPubkey: BLSPubkey,
        pocBit: uint8,
        slot: Slot,
        shard: Shard
    ): Promise<IndexedAttestation> {
        return measureExecution(
            this,
            {
                function: super.produceAttestation,
                functionName: "produceAttestation",
                instanceId: this.instanceId,
                bucket: Bucket.beaconMetrics
            },
            validatorPubkey,
            pocBit,
            slot,
            shard
        );
    }

    public async publishSignedAttestation(attestation: IndexedAttestation): Promise<any> {
        return measureExecution(
            this,
            {
                function: super.publishSignedAttestation,
                functionName: "publishSignedAttestation",
                instanceId: this.instanceId,
                bucket: Bucket.beaconMetrics
            },
            Bucket.beaconMetrics,
            attestation
        );
    }

}