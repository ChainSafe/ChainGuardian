import {IBeaconConfig} from "@chainsafe/lodestar-config";
import {Dispatch} from "redux";
import {HttpClient} from "../../../api";

export class CgEth2Base {
    protected readonly httpClient: HttpClient;
    protected readonly config: IBeaconConfig;
    protected readonly publicKey?: string;
    protected readonly dispatch?: Dispatch;

    public constructor(
        config: IBeaconConfig,
        url: string,
        {publicKey, dispatch}: {publicKey?: string; dispatch?: Dispatch} = {},
    ) {
        this.httpClient = new HttpClient(url);
        this.config = config;
        this.publicKey = publicKey;
        this.dispatch = dispatch;
    }

    public async get<T>(url: string): Promise<T> {
        return this.httpClient.get<T>(url);
    }

    public async post<T, T2>(url: string, data: T): Promise<T2> {
        return this.httpClient.post<T, T2>(url, data);
    }
}
