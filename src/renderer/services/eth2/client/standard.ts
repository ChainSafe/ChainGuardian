import {IBeaconClientOptions, IValidatorBeaconClient} from "./interface";
import {HttpClient} from "../../api";
import {EmptyUrl} from "../../api/errors";
import {ApiClientOverRest} from "@chainsafe/lodestar-validator/lib/api/impl/rest/apiClient";
import {ApiLogger} from "./logger";

export class StandardValidatorBeaconClient extends ApiClientOverRest implements IValidatorBeaconClient {
    private options: IBeaconClientOptions;
    private httpClient: HttpClient;

    public constructor(options: IBeaconClientOptions) {
        if (!options.urlPrefix) {
            throw new EmptyUrl();
        }
        super(options.config, options.urlPrefix, new ApiLogger());
        this.options = options;
        this.httpClient = new HttpClient(options.urlPrefix);
    }
    
    public async getVersion(): Promise<string> {
        return Buffer.from(await this.beacon.getClientVersion()).toString("ascii");
    }

}
