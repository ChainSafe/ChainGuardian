import {IBeaconClientOptions, IValidatorBeaconClient} from "./interface";
import {Client} from "../../api/http/client";
import {EmptyUrl} from "../../api/errors";
import {ApiClientOverRest} from "@chainsafe/lodestar-validator/lib/api/impl/rest/apiClient";
import {ApiLogger} from "./logger";

export class StandardValidatorBeaconClient extends ApiClientOverRest implements IValidatorBeaconClient {
    private options: IBeaconClientOptions;
    private httpClient: Client;

    public constructor(options: IBeaconClientOptions) {
        if (!options.urlPrefix) {
            throw new EmptyUrl();
        }
        super(options.config, options.urlPrefix, new ApiLogger());
        this.options = options;
        this.httpClient = new Client(options.urlPrefix);
    }
    
    public async getVersion(): Promise<string> {
        return (await this.beacon.getClientVersion()).toString("ascii");
    }

}
