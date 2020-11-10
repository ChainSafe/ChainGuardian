import {AbstractApiClient} from "@chainsafe/lodestar-validator/lib/api/abstract";
import {
    IBeaconClientOptions,
    IEth2BeaconApi,
    IEth2NodeApi,
    IEth2ValidatorApi,
    IGenericEth2Client,
    IValidatorBeaconClient,
} from "../interface";
import {IBeaconConfig} from "@chainsafe/lodestar-config";
import logger from "electron-log";
import {LighthouseBeaconApiClient} from "./beacon";
import {LighthouseValidatorApiClient} from "./validator";
import {IEth2ChainHead} from "../../../../models/types/head";
import {LighthouseNodeApiClient} from "./node";

export class LighthouseEth2ApiClient extends AbstractApiClient implements IValidatorBeaconClient, IGenericEth2Client {
    public url: string;
    public beacon: IEth2BeaconApi;
    public node: IEth2NodeApi;
    public validator: IEth2ValidatorApi;

    public config: IBeaconConfig;

    public constructor(options: IBeaconClientOptions) {
        super(options.config);
        this.url = options.baseUrl;
        this.config = options.config;
        this.beacon = new LighthouseBeaconApiClient(options);
        this.node = new LighthouseNodeApiClient(options);
        this.validator = new LighthouseValidatorApiClient(options, this.beacon);
    }

    public async getVersion(): Promise<string> {
        return await this.node.getVersion();
    }

    public onNewChainHead(callback: (head: IEth2ChainHead) => void): NodeJS.Timeout {
        return setInterval(async () => {
            try {
                const response = await this.beacon.getChainHead();
                callback(response);
            } catch (e) {
                logger.error(`Error while fetching head in onNewChainHead: ${e.message}`);
            }
        }, this.config.params.SECONDS_PER_SLOT * 1000);
    }
}
