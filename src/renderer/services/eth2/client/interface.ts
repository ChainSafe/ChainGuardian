import {IBeaconConfig} from "@chainsafe/lodestar-config";
import {ILogger, IStoppableEventIterable} from "@chainsafe/lodestar-utils";
import {IApiClient} from "@chainsafe/lodestar-validator/lib";
import {
    IBeaconApi,
    IBeaconBlocksApi,
    IBeaconPoolApi,
    IBeaconStateApi,
} from "@chainsafe/lodestar-validator/lib/api/interface/beacon";
import {INodeApi} from "@chainsafe/lodestar-validator/lib/api/interface/node";
import {IValidatorApi} from "@chainsafe/lodestar-validator/lib/api/interface/validators";
import {
    BeaconBlockEvent,
    BeaconChainReorgEvent,
    HeadEvent,
    IEventsApi,
} from "@chainsafe/lodestar-validator/lib/api/interface/events";
import {
    BLSPubkey,
    FinalizedCheckpoint,
    ValidatorIndex,
    ValidatorResponse,
    ValidatorStatus,
    SignedBeaconBlock,
    Fork,
    BeaconCommitteeResponse,
} from "@chainsafe/lodestar-types";
import {List} from "@chainsafe/ssz";
import {Attestation} from "@chainsafe/lodestar-types/lib/types/operations";

export interface ICGETH2BeaconBlocksApi extends IBeaconBlocksApi {
    getBlock(blockId: "head" | "genesis" | "finalized" | number): Promise<SignedBeaconBlock>;
    getBlockAttestations(blockId: "head" | "genesis" | "finalized" | number): Promise<List<Attestation> | null>;
}

// extend all known statuses can get from different beacon nodes vendors
enum CgValidatorStatus {
    UNKNOWN = "unknown",
    WITHDRAWABLE = "withdrawable",
    WITHDRAWNED = "withdrawned",
}

export interface ICGValidatorResponse extends Omit<ValidatorResponse, "status"> {
    status: CgValidatorStatus & ValidatorStatus;
}

export interface ICGBeaconStateApi extends Omit<IBeaconStateApi, "getStateValidator"> {
    getStateValidator(
        stateId: "head" | number,
        validatorId: ValidatorIndex | BLSPubkey,
    ): Promise<ICGValidatorResponse | null>;
    getLastEpoch(): Promise<bigint | null>;
    getCommittees(stateId?: "head" | number): Promise<BeaconCommitteeResponse[]>;
}

export interface ICGEth2BeaconApi extends Omit<IBeaconApi, "blocks" | "state" | "pool"> {
    blocks: ICGETH2BeaconBlocksApi;
    state: ICGBeaconStateApi;
    pool: ICGBeaconPoolApi;
}

export type PeerCount = {
    disconnected: number;
    connecting: number;
    connected: number;
    disconnecting: number;
};
export type PeerCountResult = {
    disconnected: string;
    connecting: string;
    connected: string;
    disconnecting: string;
};

export interface ICGEth2NodeApi extends INodeApi {
    getPeerCount: () => Promise<PeerCount>;
}

export type ICGEth2ValidatorApi = IValidatorApi;

export enum CGBeaconEventType {
    BLOCK = "block",
    CHAIN_REORG = "chain_reorg",
    HEAD = "head",
    FINALIZED_CHECKPOINT = "finalized_checkpoint",
    ATTESTATION = "attestation",
    ERROR = "error",
}

export declare type FinalizedCheckpointEvent = {
    type: typeof CGBeaconEventType.FINALIZED_CHECKPOINT;
    message: FinalizedCheckpoint;
};

export declare type AttestationEvent = {
    type: typeof CGBeaconEventType.ATTESTATION;
    message: Attestation;
};

export declare type ErrorEvent = {
    type: typeof CGBeaconEventType.ERROR;
};

export type CGBeaconEvent =
    | BeaconBlockEvent
    | BeaconChainReorgEvent
    | HeadEvent
    | FinalizedCheckpointEvent
    | AttestationEvent;

export interface ICGEventsApi extends Omit<IEventsApi, "getEventStream"> {
    getEventStream(topics: CGBeaconEventType[]): IStoppableEventIterable<CGBeaconEvent | ErrorEvent>;
}

export type DepositContract = {
    data: {
        // eslint-disable-next-line camelcase
        chain_id: string;
        address: string;
    };
};
export interface ICGEth2Config {
    getForkSchedule(): Promise<Fork[]>;
    getDepositContract(): Promise<DepositContract["data"]>;
}

/**
 * Extends minimal interface(IApiClient) required by lodestar validator
 */
export interface ICgEth2ApiClient extends Omit<IApiClient, "beacon" | "validator" | "node" | "configApi"> {
    beacon: ICGEth2BeaconApi;
    validator: ICGEth2ValidatorApi;
    node: ICGEth2NodeApi;
    configApi: ICGEth2Config;
}

export type IValidatorBeaconClient = IApiClient;

export interface IBeaconClientOptions {
    // Add more options if needed
    baseUrl: string;
    logger: ILogger;
    config: IBeaconConfig;
}

export type PoolStatus = {
    attestations: number;
    attesterSlashings: number;
    voluntaryExits: number;
    proposerSlashings: number;
};

export interface ICGBeaconPoolApi extends IBeaconPoolApi {
    getPoolStatus(): Promise<PoolStatus>;
}
