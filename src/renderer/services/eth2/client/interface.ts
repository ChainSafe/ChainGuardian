import {IBeaconConfig} from "@chainsafe/eth2.0-config";
import {IApiClient} from "@chainsafe/lodestar-validator/lib";
import {IBeaconApi} from "@chainsafe/lodestar-validator/lib/api/interface/beacon";
import {BLSPubkey, Validator} from "@chainsafe/eth2.0-types";
import {IValidatorApi} from "@chainsafe/lodestar-validator/lib/api/interface/validators";

export interface IEth2BeaconApi extends IBeaconApi {
    getValidator(pubkey: BLSPubkey): Promise<Validator|null>;
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
    
}

export type IValidatorBeaconClient  =  IApiClient;

export interface IBeaconClientOptions {
    // Add more options if needed
    urlPrefix: string;
    config: IBeaconConfig;
}