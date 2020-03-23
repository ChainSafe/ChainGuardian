import {IBeaconConfig} from "@chainsafe/eth2.0-config";
import {AbstractApiClient} from "@chainsafe/lodestar-validator/lib/api/abstract";

import {getNetworkConfig} from "../../networks";
import {
    IBeaconClientOptions,
    IEth2BeaconApi,
    IEth2ValidatorApi,
    IGenericEth2Client,
    IValidatorBeaconClient,
} from "../interface";
import {PrysmBeaconApiClient} from "./beacon";
import {PrysmValidatorApiClient} from "./validator";

const apiPrefix = "/eth/v1alpha1";

export class PrysmEth2ApiClient extends AbstractApiClient implements IValidatorBeaconClient, IGenericEth2Client {

    public url: string;
    public beacon: IEth2BeaconApi;
    public validator: IEth2ValidatorApi;
    public config: IBeaconConfig;

    public constructor(options: IBeaconClientOptions) {
        super();
        options.baseUrl = `${options.baseUrl}${apiPrefix}`;
        this.url = options.baseUrl;
        this.config = options.config;
        this.beacon = new PrysmBeaconApiClient(options);
        this.validator = new PrysmValidatorApiClient(options);
    }

    public static getPrysmBeaconClient(url: string, network: string): PrysmEth2ApiClient | null {
        const networkConfig = getNetworkConfig(network);
        if (!networkConfig) {
            return null;
        }

        return new PrysmEth2ApiClient({
            baseUrl: url,
            config: networkConfig.eth2Config
        });
    }

    public async getVersion(): Promise<string> {
        return (await this.beacon.getClientVersion()).toString("ascii");
    }

    public async isSyncing(): Promise<boolean> {
        const result = await this.beacon.getSyncingStatus();
        return (typeof result === "boolean") ? result : false;
    }
}