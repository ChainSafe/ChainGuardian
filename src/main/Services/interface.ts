export interface IService {
    start(): Promise<void>;
    stop(): Promise<void>;
}
