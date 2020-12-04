import {Repository} from "../repository";
import {JSONSerializer} from "../../serializers/json";
import {Bucket} from "../../schema";
import {DEFAULT_ACCOUNT} from "../../../../constants/account";
import {NetworkMetric, NetworkMetrics} from "../../../../models/networkMetrics";
import {NetworkMetricsType} from "../../../../models/types/networkMetrics";
import {IDatabaseController} from "@chainsafe/lodestar-db";

export class NetworkMetricsRepository extends Repository<NetworkMetrics> {
    public constructor(db: IDatabaseController<Buffer, Buffer>) {
        super(db, JSONSerializer, Bucket.networkMetrics, NetworkMetricsType);
    }

    public get = async (id: string): Promise<NetworkMetrics> =>
        new NetworkMetrics(await super.get(this.getKeyName(id)));

    public has = async (id: string): Promise<boolean> => await super.has(this.getKeyName(id));

    public set = async (id: string, value: NetworkMetrics): Promise<void> =>
        await super.set(this.getKeyName(id), value);

    public delete = async (id: string): Promise<void> => await super.delete(this.getKeyName(id));

    public addRecord = async (id: string, record: NetworkMetric): Promise<void> => {
        const metrics = await this.get(id);
        metrics.addRecord(record);
        await this.set(id, metrics);
    };

    private getKeyName = (key: string): string => `${DEFAULT_ACCOUNT}-${key}`;
}
