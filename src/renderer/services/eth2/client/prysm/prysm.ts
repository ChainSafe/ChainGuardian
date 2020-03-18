import {AbstractApiClient} from "@chainsafe/lodestar-validator/lib/api/abstract";
import {getNetworkConfig} from "../../networks";
import {IBeaconClientOptions, IValidatorBeaconClient} from "../interface";
import {IValidatorApi} from "@chainsafe/lodestar-validator/lib/api/interface/validators";
import {IBeaconConfig} from "@chainsafe/eth2.0-config";
import {IBeaconApiClient} from "../types";
import {PrysmBeaconApiClient} from "./beacon";
import {PrysmValidatorApiClient} from "./validator";

export class PrysmBeaconClient extends AbstractApiClient implements IValidatorBeaconClient {

    public url: string;
    public beacon: IBeaconApiClient;
    public validator: IValidatorApi;
    
    protected config: IBeaconConfig;

    public constructor(options: IBeaconClientOptions) {
        super();
        this.url = options.urlPrefix;
        this.config = options.config;
        this.beacon = new PrysmBeaconApiClient(options);
        this.validator = new PrysmValidatorApiClient(options);
    }

    public static getPrysmBeaconClient(url: string, network: string): PrysmBeaconClient | null {
        const networkConfig = getNetworkConfig(network);
        if (!networkConfig) {
            return null;
        }

        return new PrysmBeaconClient({
            urlPrefix: url,
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

    public async getChainHeight(): Promise<string> {
        return (await this.beacon.getChainHead()).headSlot;
    }
}
