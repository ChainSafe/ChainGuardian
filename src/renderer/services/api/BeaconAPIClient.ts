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
import {Syncing, ForkInformation, IBeaconAPIClient, IBeaconApiClientOptions} from "./interface";
import {HttpClient} from "./http/httpClient";
import {EmptyUrlError} from "./errors/EmptyUrlError";
import {trackMetrics} from "./http/metricsDecorator";
import {Bucket} from "../db/schema";

export class BeaconAPIClient implements IBeaconAPIClient {
    private options: IBeaconApiClientOptions;
    private httpClient: HttpClient;

    public constructor(options: IBeaconApiClientOptions) {
        if (!options.urlPrefix) {
            throw new EmptyUrlError();
        }
        this.options = options;
        this.httpClient = new HttpClient(options.urlPrefix);
    }

    @trackMetrics(true, Bucket.httpMetrics)
    public async fetchNodeVersion(): Promise<string> {
        return this.httpClient.get<string>(FETCH_NODE_VERSION);
    }

    @trackMetrics(true, Bucket.httpMetrics)
    public async fetchGenesisTime(): Promise<uint64> {
        return this.httpClient.get<uint64>(FETCH_GENESIS_TIME);
    }

    public async fetchNodeSyncing(): Promise<Syncing> {
        return this.httpClient.get<Syncing>(POLL_NODE_SYNCING);
    }

    @trackMetrics(true, Bucket.httpMetrics)
    public async fetchForkInformation(): Promise<ForkInformation> {
        return this.httpClient.get<ForkInformation>(FETCH_FORK_INFORMATION);
    }

    @trackMetrics(true, Bucket.httpMetrics)
    public async fetchValidatorDuties(validatorPubkeys: BLSPubkey[], epoch: Epoch): Promise<ValidatorDuty> {
        return this.httpClient.get<ValidatorDuty>(FETCH_VALIDATOR_DUTIES(validatorPubkeys, epoch));
    }

    @trackMetrics(true, Bucket.httpMetrics)
    public async fetchValidatorBlock(slot: Slot, randaoReveal: string): Promise<BeaconBlock> {
        return this.httpClient.get<BeaconBlock>(FETCH_VALIDATOR_BLOCK(slot, randaoReveal));
    }

    @trackMetrics(true, Bucket.httpMetrics)
    public async publishSignedBlock(beaconBlock: BeaconBlock): Promise<any> {
        return this.httpClient.post<BeaconBlock, any>(PUBLISH_SIGNED_BLOCK, beaconBlock);
    }

    @trackMetrics(true, Bucket.httpMetrics)
    public async produceAttestation(
        validatorPubkey: BLSPubkey,
        pocBit: uint8,
        slot: Slot,
        shard: Shard
    ): Promise<IndexedAttestation> {
        return this.httpClient.get<IndexedAttestation>(PRODUCE_ATTESTATION(validatorPubkey, pocBit, slot, shard));
    }

    @trackMetrics(true, Bucket.httpMetrics)
    public async publishSignedAttestation(attestation: IndexedAttestation): Promise<any> {
        return this.httpClient.post<IndexedAttestation, any>(PUBLISH_SIGNED_ATTESTATION, attestation);
    }
}
