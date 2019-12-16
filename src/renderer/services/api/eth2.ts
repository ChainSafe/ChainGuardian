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
} from "../../constants/api";
import {Syncing, ForkInformation, IBeaconAPIClient, IBeaconApiClientOptions} from "./interface";
import {Client} from "./http/client";
import {EmptyUrl} from "./errors";

export class Eth2 implements IBeaconAPIClient {
    private options: IBeaconApiClientOptions;
    private httpClient: Client;

    public constructor(options: IBeaconApiClientOptions) {
        if (!options.urlPrefix) {
            throw new EmptyUrl();
        }
        this.options = options;
        this.httpClient = new Client(options.urlPrefix);
    }

    public async fetchNodeVersion(): Promise<string> {
        return this.httpClient.get<string>(FETCH_NODE_VERSION);
    }

    public async fetchGenesisTime(): Promise<uint64> {
        return this.httpClient.get<uint64>(FETCH_GENESIS_TIME);
    }

    public async fetchNodeSyncing(): Promise<Syncing> {
        return this.httpClient.get<Syncing>(POLL_NODE_SYNCING);
    }

    public async fetchForkInformation(): Promise<ForkInformation> {
        return this.httpClient.get<ForkInformation>(FETCH_FORK_INFORMATION);
    }

    public async fetchValidatorDuties(validatorPubkeys: BLSPubkey[], epoch: Epoch): Promise<ValidatorDuty> {
        return this.httpClient.get<ValidatorDuty>(FETCH_VALIDATOR_DUTIES(validatorPubkeys, epoch));
    }

    public async fetchValidatorBlock(slot: Slot, randaoReveal: string): Promise<BeaconBlock> {
        return this.httpClient.get<BeaconBlock>(FETCH_VALIDATOR_BLOCK(slot, randaoReveal));
    }

    public async publishSignedBlock(beaconBlock: BeaconBlock): Promise<any> {
        return this.httpClient.post<BeaconBlock, any>(PUBLISH_SIGNED_BLOCK, beaconBlock);
    }

    public async produceAttestation(
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

    public async publishSignedAttestation(attestation: IndexedAttestation): Promise<any> {
        return this.httpClient.post<IndexedAttestation, any>(PUBLISH_SIGNED_ATTESTATION, attestation);
    }
}
