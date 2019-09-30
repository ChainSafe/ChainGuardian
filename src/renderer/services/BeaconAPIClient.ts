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
} from '@chainsafe/eth2.0-types';
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
} from '../constants/apiUrls';
import { Syncing, ForkInformation, IBeaconAPIClient, IBeaconApiClientOptions } from './interface';
import { HttpClient } from './httpClient';
import { EmptyUrlError } from './errors/EmptyUrlError';

export class BeaconAPIClient implements IBeaconAPIClient {
    options: IBeaconApiClientOptions;
    httpClient: HttpClient;

    constructor(options: IBeaconApiClientOptions) {
        if (!options.urlPrefix) {
            throw new EmptyUrlError();
        }
        this.options = options;
        this.httpClient = new HttpClient(options.urlPrefix);
    }

    async fetchNodeVersion(): Promise<string> {
        const result = await this.httpClient.get<string>(FETCH_NODE_VERSION);
        return result;
    }

    async fetchGenesisTime(): Promise<uint64> {
        const result = await this.httpClient.get<uint64>(FETCH_GENESIS_TIME);
        return result;
    }

    async fetchNodeSyncing(): Promise<Syncing> {
        const result = await this.httpClient.get<Syncing>(POLL_NODE_SYNCING);
        return result;
    }

    async fetchForkInformation(): Promise<ForkInformation> {
        const result = await this.httpClient.get<ForkInformation>(FETCH_FORK_INFORMATION);
        return result;
    }

    async fetchValidatorDuties(validatorPubkeys: BLSPubkey[], epoch: Epoch): Promise<ValidatorDuty> {
        const result = await this.httpClient.get<ValidatorDuty>(FETCH_VALIDATOR_DUTIES(validatorPubkeys, epoch));
        return result;
    }

    async fetchValidatorBlock(slot: Slot, randaoReveal: string): Promise<BeaconBlock> {
        const result = await this.httpClient.get<BeaconBlock>(FETCH_VALIDATOR_BLOCK(slot, randaoReveal));
        return result;
    }

    async publishSignedBlock(beaconBlock: BeaconBlock): Promise<any> {
        const result = await this.httpClient.post<BeaconBlock, any>(PUBLISH_SIGNED_BLOCK, beaconBlock);
        return result;
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
        return result;
    }

    async publishSignedAttestation(attestation: IndexedAttestation): Promise<any> {
        const result = await this.httpClient.post<IndexedAttestation, any>(PUBLISH_SIGNED_ATTESTATION, attestation);
        return result;
    }
}
