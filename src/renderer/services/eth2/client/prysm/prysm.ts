import {IBeaconConfig} from "@chainsafe/eth2.0-config";
import {AbstractApiClient} from "@chainsafe/lodestar-validator/lib/api/abstract";

import {
    IBeaconClientOptions,
    IEth2BeaconApi,
    IEth2ValidatorApi,
    IGenericEth2Client,
    IValidatorBeaconClient,
} from "../interface";
import {PrysmBeaconApiClient} from "./beacon";
import {ChainHead} from "./types";
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

    public async getVersion(): Promise<string> {
        return (await this.beacon.getClientVersion()).toString("ascii");
    }

    public onNewChainHead(callback: (head: ChainHead) => void): void {
        // const eventSource = new EventSource(`${this.url}${PrysmBeaconRoutes.CHAINHEAD_STREAM}`);
        // eventSource.onmessage = (e: MessageEvent): void => {
        //     console.log("Got message!", e);
        //     callbacks.map(callback => callback(e.data as PrysmChainHeadStreamMessage));
        // };

        setInterval(async() => {
            const response = await this.beacon.getChainHead();
            callback(response);
        }, 12000);
    }
}