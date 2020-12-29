import {IBeaconConfig} from "@chainsafe/lodestar-config";
import {ILogger, IStoppableEventIterable} from "@chainsafe/lodestar-utils";
import {IApiClient} from "@chainsafe/lodestar-validator/lib";
import {IBeaconApi, IBeaconBlocksApi} from "@chainsafe/lodestar-validator/lib/api/interface/beacon";
import {INodeApi} from "@chainsafe/lodestar-validator/lib/api/interface/node";
import {IValidatorApi} from "@chainsafe/lodestar-validator/lib/api/interface/validators";
import {SignedBeaconBlock, FinalizedCheckpoint} from "@chainsafe/lodestar-types";
import {
    BeaconBlockEvent,
    BeaconChainReorgEvent,
    HeadEvent,
    IEventsApi,
} from "@chainsafe/lodestar-validator/lib/api/interface/events";

export interface ICGETH2BeaconBlocksApi extends IBeaconBlocksApi {
    getBlock(blockId: "head" | "genesis" | "finalized" | number): Promise<SignedBeaconBlock>;
}

export interface ICGEth2BeaconApi extends Omit<IBeaconApi, "blocks"> {
    blocks: ICGETH2BeaconBlocksApi;
}

export type ICGEth2NodeApi = INodeApi;
export type ICGEth2ValidatorApi = IValidatorApi;

export enum CGBeaconEventType {
    BLOCK = "block",
    CHAIN_REORG = "chain_reorg",
    HEAD = "head",
    FINALIZED_CHECKPOINT = "finalized_checkpoint",
}

export declare type FinalizedCheckpointEvent = {
    type: typeof CGBeaconEventType.FINALIZED_CHECKPOINT;
    message: FinalizedCheckpoint;
};

export type CGBeaconEvent = BeaconBlockEvent | BeaconChainReorgEvent | HeadEvent | FinalizedCheckpointEvent;

export interface ICGEventsApi extends Omit<IEventsApi, "getEventStream"> {
    getEventStream(topics: CGBeaconEventType[]): IStoppableEventIterable<CGBeaconEvent>;
}

/**
 * Extends minimal interface(IApiClient) required by lodestar validator
 */
export interface ICgEth2ApiClient extends Omit<IApiClient, "beacon" | "validator" | "node"> {
    beacon: ICGEth2BeaconApi;
    validator: ICGEth2ValidatorApi;
    node: ICGEth2NodeApi;
}

export type IValidatorBeaconClient = IApiClient;

export interface IBeaconClientOptions {
    // Add more options if needed
    baseUrl: string;
    logger: ILogger;
    config: IBeaconConfig;
}
