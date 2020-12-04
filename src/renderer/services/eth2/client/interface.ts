import {IBeaconConfig} from "@chainsafe/lodestar-config";
import {SignedBeaconHeaderResponse, ValidatorIndex, ValidatorResponse, BLSPubkey} from "@chainsafe/lodestar-types";
import {ILogger} from "@chainsafe/lodestar-utils";
import {IApiClient} from "@chainsafe/lodestar-validator/lib";
import {IBeaconApi, IBeaconStateApi} from "@chainsafe/lodestar-validator/lib/api/interface/beacon";
import {INodeApi} from "@chainsafe/lodestar-validator/lib/api/interface/node";
import {IValidatorApi} from "@chainsafe/lodestar-validator/lib/api/interface/validators";
import {IEth2ChainHead} from "../../../models/types/head";

export interface IEth2BeaconApi extends IBeaconApi {
    state: IBeaconStateApi & {
        getBlockHeader(stateId: "head", blockId: "head" | number | string): Promise<SignedBeaconHeaderResponse>;
        getValidator(stateId: "head", validatorId: string | BLSPubkey | ValidatorIndex): Promise<ValidatorResponse>;
        getValidators(stateId?: "head", validatorIds?: (string | ValidatorIndex)[]): Promise<ValidatorResponse[]>;
    };
}
export type IEth2NodeApi = INodeApi;
export type IEth2ValidatorApi = IValidatorApi;

/**
 * Extends minimal interface(IApiClient) required by lodestar validator
 */
export interface IGenericEth2Client extends IApiClient {
    config: IBeaconConfig;

    beacon: IEth2BeaconApi;

    validator: IEth2ValidatorApi;

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
