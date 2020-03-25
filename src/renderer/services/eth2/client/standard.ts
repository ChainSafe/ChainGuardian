import {IBeaconClientOptions, IValidatorBeaconClient} from "./interface";
import {HttpClient} from "../../api/http/httpClient";
import {EmptyUrl} from "../../api/errors";
import {ApiClientOverRest} from "@chainsafe/lodestar-validator/lib/api/impl/rest/apiClient";
import {ApiLogger} from "./logger";

export class StandardValidatorBeaconClient extends ApiClientOverRest implements IValidatorBeaconClient {
    private options: IBeaconClientOptions;
    private httpClient: HttpClient;

    public constructor(options: IBeaconClientOptions) {
        if (!options.baseUrl) {
            throw new EmptyUrl();
        }
        super(options.config, options.baseUrl, new ApiLogger());
        this.options = options;
        this.httpClient = new HttpClient(options.baseUrl);
    }
    
    public async getVersion(): Promise<string> {
        return (await this.beacon.getClientVersion()).toString("ascii");
    }

}
