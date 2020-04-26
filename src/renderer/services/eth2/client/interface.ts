import {IBeaconConfig} from "@chainsafe/lodestar-config";
import {IApiClient} from "@chainsafe/lodestar-validator/lib";
import {IBeaconApi} from "@chainsafe/lodestar-validator/lib/api/interface/beacon";
import {BLSPubkey, SignedBeaconBlock, ValidatorResponse} from "@chainsafe/lodestar-types";
import {IValidatorApi} from "@chainsafe/lodestar-validator/lib/api/interface/validators";

export interface IEth2BeaconApi extends IBeaconApi {
    getValidator(pubkey: BLSPubkey): Promise<ValidatorResponse|null>;
    getChainHead(): Promise<SignedBeaconBlock>;
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

    onNewChainHead(callback: (head: SignedBeaconBlock) => void): void;
}

export type IValidatorBeaconClient  =  IApiClient;

export interface IBeaconClientOptions {
    // Add more options if needed
    baseUrl: string;
    config: IBeaconConfig;
}