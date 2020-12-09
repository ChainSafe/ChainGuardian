import {ICGEth2ValidatorApi, IValidatorBeaconClient, ICGEth2BeaconApi, ICGEth2NodeApi} from "../interface";
import {IBeaconConfig} from "@chainsafe/lodestar-config";
import {IEventsApi} from "@chainsafe/lodestar-validator/lib/api/interface/events";
import {IEth2ChainHead} from "../../../../models/types/head";
import {Beacon} from "./beacon";
import {HttpClient} from "../../../api";
import {AbstractApiClient} from "@chainsafe/lodestar-validator/lib/api/abstract";
import {WinstonLogger} from "@chainsafe/lodestar-utils";
import {Validator} from "./validator";
import {NodeApi} from "./nodeApi";
import {Events} from "./events";

export class Eth2ApiClient extends AbstractApiClient implements IValidatorBeaconClient {
    public validator: ICGEth2ValidatorApi;
    public beacon: ICGEth2BeaconApi; //
    public node: ICGEth2NodeApi;
    public events: IEventsApi;

    public url: string;

    private readonly httpClient: HttpClient;
    public constructor(config: IBeaconConfig, url: string) {
        // TODO: logger: create new or get it from outside?
        super(config, new WinstonLogger());
        this.url = url;
        this.httpClient = new HttpClient(url);

        this.validator = new Validator(config, this.httpClient);
        this.beacon = new Beacon(config, this.httpClient);
        this.events = new Events(config, url);
        this.node = new NodeApi(config, this.httpClient);
    }

    public getVersion = async (): Promise<string> => {
        console.log("getVersion");
        return undefined as string;
    };

    public onNewChainHead = (callback: (head: IEth2ChainHead) => void): NodeJS.Timeout => {
        console.log("onNewChainHead", callback);
        return undefined as NodeJS.Timeout;
    };
}
