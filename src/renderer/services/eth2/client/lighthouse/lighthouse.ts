import {AbstractApiClient} from "@chainsafe/lodestar-validator/lib/api/abstract";
import {IBeaconClientOptions, IValidatorBeaconClient} from "../interface";
import {IValidatorApi} from "@chainsafe/lodestar-validator/lib/api/interface/validators";
import {IBeaconApi} from "@chainsafe/lodestar-validator/lib/api/interface/beacon";
import {IBeaconConfig} from "@chainsafe/lodestar-config";
import {LighthouseBeaconApiClient} from "./beacon";
import {LighthouseValidatorApiClient} from "./validator";

export class LighthouseEth2ApiClient extends AbstractApiClient implements IValidatorBeaconClient {

    public url: string;
    public beacon: IBeaconApi;
    public validator: IValidatorApi;

    protected config: IBeaconConfig;

    public constructor(options: IBeaconClientOptions) {
        super();
        this.url = options.baseUrl;
        this.config = options.config;
        this.beacon = new LighthouseBeaconApiClient(options);
        this.validator = new LighthouseValidatorApiClient(options);
    }

    public async getVersion(): Promise<string> {
        return Buffer.from((await this.beacon.getClientVersion()).valueOf() as Uint8Array).toString("ascii");
    }

}