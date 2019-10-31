import axios, {AxiosError, AxiosInstance, AxiosResponse} from "axios";
import {trackMetrics} from "./metricsDecorator";

export class HttpClient {
    private client: AxiosInstance;

    public constructor(baseURL: string) {
        this.client = axios.create({
            baseURL
        });
    }

    /**
     * Method that handles GET
     * @param url endpoint url
     */
    @trackMetrics()
    public async get<T>(url: string): Promise<T> {
        try {
            const result: AxiosResponse<T> = await this.client.get<T>(url);
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
    @trackMetrics()
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
    let message: string | number;
    if (error.response) {
        message = error.response.status;
    } else if (error.request) {
        message = error.request;
    } else {
        message = error.message;
    }

    return new Error(message.toString());
};
