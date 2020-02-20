import {IBeaconConfig} from "@chainsafe/eth2.0-config";
import {IApiClient} from "@chainsafe/lodestar-validator/lib";

export interface IGenericBeaconClient {
    getVersion(): Promise<string>;
}

export interface IValidatorBeaconClient extends IApiClient, IGenericBeaconClient {
    
}

export interface IBeaconClientOptions {
    // Add more options if needed
    urlPrefix: string;
    config: IBeaconConfig;
}