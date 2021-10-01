import {Dispatch} from "redux";
import {HttpClient} from "../../../api";
import {IChainForkConfig} from "@chainsafe/lodestar-config/lib/beaconConfig";
import querystring from "querystring";

export class CgEth2Base {
    protected readonly httpClient: HttpClient;
    protected readonly config: IChainForkConfig;
    protected readonly publicKey?: string;
    protected readonly dispatch?: Dispatch;

    public constructor(
        config: IChainForkConfig,
        url: string,
        {publicKey, dispatch}: {publicKey?: string; dispatch?: Dispatch} = {},
    ) {
        const paramsSerializer = (params: Record<string, any>): string => {
            for (const param in params) {
                if (params[param] === undefined || params[param] === null || params[param].length === 0)
                    delete params[param];
            }
            return querystring.stringify(params);
        };

        this.httpClient = new HttpClient(url, {axios: {paramsSerializer}});
        this.config = config;
        this.publicKey = publicKey;
        this.dispatch = dispatch;
    }

    public async get<T>(url: string, params?: Record<string, any>): Promise<T> {
        return this.httpClient.get<T>(url, {params});
    }

    public async post<T, T2>(url: string, data: T, params?: Record<string, any>): Promise<T2> {
        return this.httpClient.post<T, T2>(url, data, {params});
    }
}
