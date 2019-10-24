import {
    uint64,
    BLSPubkey,
    Epoch,
    ValidatorDuty,
    Slot,
    BeaconBlock,
    uint8,
    Shard,
    IndexedAttestation
} from "@chainsafe/eth2.0-types";
import {IBeaconConfig} from "@chainsafe/eth2.0-config";
import {fromJson} from "@chainsafe/eth2.0-utils";
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
} from "../../constants/apiUrls";
import {Syncing, ForkInformation, IBeaconApiClientOptions} from "./interface";
import {HttpClient} from "./http/httpClient";
import {EmptyUrlError} from "./errors/EmptyUrlError";

export class BeaconAPIClient {
    options: IBeaconApiClientOptions;
    config: IBeaconConfig;
    httpClient: HttpClient;

    constructor(options: IBeaconApiClientOptions, config: IBeaconConfig) {
        if (!options.urlPrefix) {
            throw new EmptyUrlError();
        }
        this.options = options;
        this.config = config;
        this.config.types.Attestation;
        this.httpClient = new HttpClient(options.urlPrefix);
    }


    async fetchNodeVersion(): Promise<string> {
        return this.httpClient.get<string>(FETCH_NODE_VERSION);
    }

    async fetchGenesisTime(): Promise<uint64> {
        const result = await this.httpClient.get<uint64>(FETCH_GENESIS_TIME);
        return fromJson(result, this.config.types.uint64);
    }

    async fetchNodeSyncing(): Promise<Syncing> {
        return this.httpClient.get<Syncing>(POLL_NODE_SYNCING);
    }

    async fetchForkInformation(): Promise<ForkInformation> {
        return this.httpClient.get<ForkInformation>(FETCH_FORK_INFORMATION);
    }

    async fetchValidatorDuties(validatorPubkeys: BLSPubkey[], epoch: Epoch): Promise<ValidatorDuty> {
        return this.httpClient.get<ValidatorDuty>(FETCH_VALIDATOR_DUTIES(validatorPubkeys, epoch));
    }

    async fetchValidatorBlock(slot: Slot, randaoReveal: string): Promise<BeaconBlock> {
        const result = this.httpClient.get<BeaconBlock>(FETCH_VALIDATOR_BLOCK(slot, randaoReveal));
        return fromJson(result, this.config.types.BeaconBlock);
    }

    async publishSignedBlock(beaconBlock: BeaconBlock): Promise<any> {
        return this.httpClient.post<BeaconBlock, any>(PUBLISH_SIGNED_BLOCK, beaconBlock);
    }

    async produceAttestation(
        validatorPubkey: BLSPubkey,
        pocBit: uint8,
        slot: Slot,
        shard: Shard
    ): Promise<IndexedAttestation> {
        const result = await this.httpClient.get<IndexedAttestation>(
            PRODUCE_ATTESTATION(validatorPubkey, pocBit, slot, shard)
        );
        return fromJson(result, this.config.types.IndexedAttestation);
    }

    async publishSignedAttestation(attestation: IndexedAttestation): Promise<any> {
        return this.httpClient.post<IndexedAttestation, any>(PUBLISH_SIGNED_ATTESTATION, attestation);
    }
}
