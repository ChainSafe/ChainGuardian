import {AbstractApiClient} from "@chainsafe/lodestar-validator/lib/api/abstract";
import {IBeaconClientOptions, IValidatorBeaconClient} from "../interface";
import {IValidatorApi} from "@chainsafe/lodestar-validator/lib/api/interface/validators";
import {IBeaconApi} from "@chainsafe/lodestar-validator/lib/api/interface/beacon";
import {IBeaconConfig} from "@chainsafe/eth2.0-config";
import {PrysmBeaconApiClient} from "./beacon";
import {PrysmValidatorApiClient} from "./validator";

export class PrysmBeaconClient extends AbstractApiClient implements IValidatorBeaconClient {

    public url: string;
    public beacon: IBeaconApi;
    public validator: IValidatorApi;
    
    protected config: IBeaconConfig;

    public constructor(options: IBeaconClientOptions) {
        super();
        this.url = options.urlPrefix;
        this.config = options.config;
        this.beacon = new PrysmBeaconApiClient(options);
        this.validator = new PrysmValidatorApiClient(options);
    }
    
    public async getVersion(): Promise<string> {
        return (await this.beacon.getClientVersion()).toString("ascii");
    }

}