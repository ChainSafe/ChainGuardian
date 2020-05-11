import {IBeaconConfig} from "@chainsafe/lodestar-config";
import {IApiClient} from "@chainsafe/lodestar-validator/lib";
import {IBeaconApi} from "@chainsafe/lodestar-validator/lib/api/interface/beacon";
import {BLSPubkey, ValidatorResponse} from "@chainsafe/lodestar-types";
import {IValidatorApi} from "@chainsafe/lodestar-validator/lib/api/interface/validators";
import {IEth2ChainHead} from "../../../models/head";
import { ILogger } from '@chainsafe/lodestar-utils';

export interface IEth2BeaconApi extends IBeaconApi {
    getValidator(pubkey: BLSPubkey): Promise<ValidatorResponse|null>;
    getChainHead(): Promise<IEth2ChainHead>;
}

export type IEth2ValidatorApi  = IValidatorApi;

/**
 * Extends minimal interface(IApiClient) required by lodestar validator
 */
export interface IGenericEth2Client extends IApiClient {

    config: IBeaconConfig;

    beacon: IEth2BeaconApi;

    validator: IEth2ValidatorApi;

    getVersion(): Promise<string>;

    onNewChainHead(callback: (head: IEth2ChainHead) => void): void;
}

export type IValidatorBeaconClient  =  IApiClient;

export interface IBeaconClientOptions {
    // Add more options if needed
    baseUrl: string;
    logger: ILogger,
    config: IBeaconConfig;
}
