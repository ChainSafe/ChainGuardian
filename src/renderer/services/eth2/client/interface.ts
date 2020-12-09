import {IBeaconConfig} from "@chainsafe/lodestar-config";
import {ILogger} from "@chainsafe/lodestar-utils";
import {IApiClient} from "@chainsafe/lodestar-validator/lib";
import {IBeaconApi, IBeaconStateApi} from "@chainsafe/lodestar-validator/lib/api/interface/beacon";
import {INodeApi} from "@chainsafe/lodestar-validator/lib/api/interface/node";
import {IValidatorApi} from "@chainsafe/lodestar-validator/lib/api/interface/validators";
import {IEth2ChainHead} from "../../../models/types/head";
import {BLSPubkey, SignedBeaconHeaderResponse, ValidatorIndex, ValidatorResponse} from "@chainsafe/lodestar-types";

export interface ICGEth2BeaconApiState extends IBeaconStateApi {
    getBlockHeader(stateId: "head", blockId: "head" | number | string): Promise<SignedBeaconHeaderResponse>;
    getValidator(stateId: "head", validatorId: string | BLSPubkey | ValidatorIndex): Promise<ValidatorResponse>;
    getValidators(stateId?: "head", validatorIds?: (string | ValidatorIndex)[]): Promise<ValidatorResponse[]>;
}

export interface ICGEth2BeaconApi extends IBeaconApi {
    state: ICGEth2BeaconApiState;
}
export type ICGEth2NodeApi = INodeApi;
export type ICGEth2ValidatorApi = IValidatorApi;

/**
 * Extends minimal interface(IApiClient) required by lodestar validator
 */
export interface ICgEth2ApiClient extends IApiClient {
    config: IBeaconConfig;
    beacon: ICGEth2BeaconApi;
    validator: ICGEth2ValidatorApi;
    node: ICGEth2NodeApi;

    getVersion(): Promise<string>;
    onNewChainHead(callback: (head: IEth2ChainHead) => void): NodeJS.Timeout;
}

export type IValidatorBeaconClient = IApiClient;

export interface IBeaconClientOptions {
    // Add more options if needed
    baseUrl: string;
    logger: ILogger;
    config: IBeaconConfig;
}
