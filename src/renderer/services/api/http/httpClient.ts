import axios, {AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse} from "axios";

export class HttpClient {
    private client: AxiosInstance;

    public constructor(baseURL: string, options: {axios?: AxiosRequestConfig} = {}) {
        if (!options) {
            // eslint-disable-next-line no-param-reassign
            options = {axios: {}};
        }
        this.client = axios.create({
            baseURL,
            ...options.axios,
        });
    }

    /**
     * Method that handles GET
     * @param url endpoint url
     * @param config
     */
    public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        try {
            const result: AxiosResponse<T> = await this.client.get<T>(url, config);
            return result.data;
        } catch (reason) {
            throw handleError(reason);
        }
    }

    /**
     * Method that handles POST
     * @param url endpoint url
     * @param data request body
     */
    public async post<T, T2>(url: string, data: T): Promise<T2> {
        try {
            const result: AxiosResponse<T2> = await this.client.post(url, data);
            return result.data;
        } catch (reason) {
            throw handleError(reason);
        }
    }
}

const handleError = (error: AxiosError): Error => {
    let message: string;
    if (error.response) {
        message = error.response.data || error.response.statusText;
    } else {
        message = error.message.toString();
    }
    return new Error(message);
};
