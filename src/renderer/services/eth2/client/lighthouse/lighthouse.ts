import {AbstractApiClient} from "@chainsafe/lodestar-validator/lib/api/abstract";
import {
    IBeaconClientOptions,
    IEth2BeaconApi,
    IEth2ValidatorApi,
    IGenericEth2Client,
    IValidatorBeaconClient
} from "../interface";
import {IBeaconConfig} from "@chainsafe/lodestar-config";
import logger from "electron-log";
import {LighthouseBeaconApiClient} from "./beacon";
import {LighthouseValidatorApiClient} from "./validator";
import {IEth2ChainHead} from "../../../../models/types/head";

export class LighthouseEth2ApiClient extends AbstractApiClient implements IValidatorBeaconClient,IGenericEth2Client {

    public url: string;
    public beacon: IEth2BeaconApi;
    public validator: IEth2ValidatorApi;

    public config: IBeaconConfig;

    public constructor(options: IBeaconClientOptions) {
        super();
        this.url = options.baseUrl;
        this.config = options.config;
        this.beacon = new LighthouseBeaconApiClient(options);
        this.validator = new LighthouseValidatorApiClient(options, this.beacon);
    }

    public async getVersion(): Promise<string> {
        return Buffer.from((await this.beacon.getClientVersion()).valueOf() as Uint8Array).toString("ascii");
    }

    public onNewChainHead(callback: (head: IEth2ChainHead) => void): void {
        setInterval(async() => {
            try {
                const response = await this.beacon.getChainHead();
                callback(response);
            } catch (e) {
                logger.error(`Error while fetching head in onNewChainHead: ${e.message}`);
            }
        }, this.config.params.SECONDS_PER_SLOT * 1000);
    }

}
