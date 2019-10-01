export interface IService {
    start(): Promise<any>;
    stop(): Promise<void>;
}
