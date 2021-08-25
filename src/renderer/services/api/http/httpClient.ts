import axios, {AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse} from "axios";
import database from "../../db/api/database";

const axiosConfigDefault: AxiosRequestConfig = {timeout: 3000};

export class HttpClient {
    private client: AxiosInstance;

    public constructor(baseURL: string, options: {axios?: AxiosRequestConfig} = {}) {
        if (!options) {
            // eslint-disable-next-line no-param-reassign
            options = {axios: axiosConfigDefault};
        }
        this.client = axios.create({
            baseURL,
            ...{...axiosConfigDefault, ...options.axios},
        });
    }

    public getBaseUrl(): string {
        return this.client.defaults.baseURL;
    }

    /**
     * Method that handles GET
     * @param url endpoint url
     * @param config
     */
    public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const {onComplete, onError} = this.networkMetrics();
        try {
            const result: AxiosResponse<T> = await this.client.get<T>(url, config);
            onComplete(result);
            return result.data;
        } catch (reason) {
            onError(reason);
            throw handleError(reason);
        }
    }

    /**
     * Method that handles POST
     * @param url endpoint url
     * @param data request body
     */
    public async post<T, T2>(url: string, data: T, config?: AxiosRequestConfig): Promise<T2> {
        const {onComplete, onError} = this.networkMetrics();
        try {
            const result: AxiosResponse<T2> = await this.client.post(url, data, config);
            onComplete(result);
            return result.data;
        } catch (reason) {
            onError(reason);
            throw handleError(reason);
        }
    }

    /**
     * Method that store and handles metrics data
     */
    private networkMetrics = (): {
        onComplete: (status: AxiosResponse) => void;
        onError: (error: AxiosError) => void;
    } => {
        const start = Date.now();
        return {
            onComplete: ({request, status, config}: AxiosResponse): void => {
                if (process.env.NODE_ENV !== "validator-test")
                    database.networkMetrics.addRecord(config.baseURL, {
                        url: request.responseURL,
                        code: status,
                        latency: Date.now() - start,
                        time: Date.now(),
                    });
            },
            onError: ({response, config}: AxiosError): void => {
                if (process.env.NODE_ENV !== "validator-test")
                    database.networkMetrics.addRecord(config.baseURL, {
                        url: config.url,
                        code: response?.status || 0,
                        latency: Date.now() - start,
                        time: Date.now(),
                    });
            },
        };
    };
}

const handleError = (error: AxiosError): Error => {
    let message: string;
    if (error.response) {
        message = JSON.stringify(error.response.data) || error.response.statusText;
    } else {
        message = JSON.stringify(error.toJSON());
    }
    return new Error(message);
};
