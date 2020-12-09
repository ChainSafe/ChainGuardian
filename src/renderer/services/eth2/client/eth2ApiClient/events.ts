import {BeaconEvent, BeaconEventType, IEventsApi} from "@chainsafe/lodestar-validator/lib/api/interface/events";
import {IStoppableEventIterable} from "@chainsafe/lodestar-utils";
import {HttpClient} from "../../../api";
import {IBeaconConfig} from "@chainsafe/lodestar-config";

export class Events implements IEventsApi {
    private readonly httpClient: HttpClient;
    private readonly config: IBeaconConfig;
    public constructor(config: IBeaconConfig, httpClient: HttpClient) {
        this.config = config;
        this.httpClient = httpClient;
    }

    public getEventStream = (topics: BeaconEventType[]): IStoppableEventIterable<BeaconEvent> => {
        console.log("getEventStream", topics);
        return undefined as IStoppableEventIterable<BeaconEvent>;
    };
}
