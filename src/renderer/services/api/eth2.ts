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
import {fromJson, toJson} from "@chainsafe/eth2.0-utils";
import {
    FETCH_FORK_INFORMATION,
    FETCH_GENESIS_TIME,
    FETCH_NODE_VERSION,
    FETCH_VALIDATOR_BLOCK,
    FETCH_VALIDATOR_DUTIES,
    POLL_NODE_SYNCING,
    PRODUCE_ATTESTATION,
    PUBLISH_SIGNED_ATTESTATION,
    PUBLISH_SIGNED_BLOCK
} from "../../constants/api";
import {IBeaconAPIClient, IBeaconApiClientOptions} from "./interface";
import {Client} from "./http/client";
import {EmptyUrl} from "./errors";
import {getChainForkSSZType, IChainFork, ISyncing, SyncingSSZType, ValidatorDutySSZTyoe} from "./types";
import {AnyContainerType} from "@chainsafe/ssz";

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
        return BigInt(await this.httpClient.get<string>(FETCH_GENESIS_TIME));
    }

    public async fetchNodeSyncing(): Promise<ISyncing> {
        return fromJson<ISyncing>(
            await this.httpClient.get<AnyContainerType>(POLL_NODE_SYNCING),
            SyncingSSZType
        );
    }

    public async fetchForkInformation(): Promise<IChainFork> {
        return fromJson<IChainFork>(
            await this.httpClient.get<AnyContainerType>(FETCH_FORK_INFORMATION),
            getChainForkSSZType(this.options.config)
        );
    }

    public async fetchValidatorDuties(validatorPubkeys: BLSPubkey[], epoch: Epoch): Promise<ValidatorDuty> {
        return fromJson<ValidatorDuty>(
            await this.httpClient.get<AnyContainerType>(FETCH_VALIDATOR_DUTIES(validatorPubkeys, epoch)),
            ValidatorDutySSZTyoe
        );
    }

    public async fetchValidatorBlock(slot: Slot, randaoReveal: string): Promise<BeaconBlock> {
        return fromJson<BeaconBlock>(
            await this.httpClient.get<AnyContainerType>(FETCH_VALIDATOR_BLOCK(slot, randaoReveal)),
            this.options.config.types.BeaconBlock
        );
    }

    public async publishSignedBlock(beaconBlock: BeaconBlock): Promise<void> {
        await this.httpClient.post<object, void>(PUBLISH_SIGNED_BLOCK, toJson(beaconBlock));
    }

    public async produceAttestation(
        validatorPubkey: BLSPubkey,
        pocBit: uint8,
        slot: Slot,
        shard: number,
    ): Promise<IndexedAttestation> {
        const result = await this.httpClient.get<AnyContainerType>(
            PRODUCE_ATTESTATION(validatorPubkey, pocBit, slot, shard)
        );
        return fromJson(result, this.options.config.types.IndexedAttestation);
    }

    public async publishSignedAttestation(attestation: IndexedAttestation): Promise<void> {
        await this.httpClient.post<object, void>(PUBLISH_SIGNED_ATTESTATION, toJson(attestation));
    }
}
