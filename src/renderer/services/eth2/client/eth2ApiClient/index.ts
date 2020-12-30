import {ICGEth2ValidatorApi, ICGEth2BeaconApi, ICGEth2NodeApi, ICgEth2ApiClient, ICGEth2Config} from "../interface";
import {IBeaconConfig} from "@chainsafe/lodestar-config";
import {IEventsApi} from "@chainsafe/lodestar-validator/lib/api/interface/events";
import {CgEth2BeaconApi} from "./cgEth2BeaconApi";
import {HttpClient} from "../../../api";
import {AbstractApiClient} from "@chainsafe/lodestar-validator/lib/api/abstract";
import {WinstonLogger} from "@chainsafe/lodestar-utils";
import {CgEth2ValidatorApi} from "./cgEth2ValidatorApi";
import {CgEth2NodeApi} from "./cgEth2NodeApi";
import {CgEth2EventsApi} from "./cgEth2EventsApi";
import {CgEth2Config} from "./cgEth2Config";

export class CgEth2ApiClient extends AbstractApiClient implements ICgEth2ApiClient {
    public validator: ICGEth2ValidatorApi;
    public beacon: ICGEth2BeaconApi; //
    public node: ICGEth2NodeApi;
    public events: IEventsApi;
    public networkConfig: ICGEth2Config;

    public url: string;

    private readonly httpClient: HttpClient;
    public constructor(config: IBeaconConfig, url: string) {
        // TODO: logger: create new or get it from outside?
        super(config, new WinstonLogger());
        this.url = url;
        this.httpClient = new HttpClient(url);

        this.validator = new CgEth2ValidatorApi(config, this.httpClient);
        this.beacon = new CgEth2BeaconApi(config, this.httpClient);
        this.events = (new CgEth2EventsApi(config, url) as unknown) as IEventsApi;
        this.node = new CgEth2NodeApi(config, this.httpClient);
        this.networkConfig = new CgEth2Config(config, this.httpClient);
    }
}
