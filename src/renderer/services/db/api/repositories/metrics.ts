import {BulkRepository} from "../repository";
import {Bucket, encodeKey} from "../../schema";
import {IBeaconConfig} from "@chainsafe/eth2.0-config";
import {IDatabaseController} from "../../controller";
import {Metrics as SZMetrics} from "../../../../models/ssz/types";
import {JSONSerializer} from "../../serializers/json";
import {Metrics} from "../../../../models/metrics";
import {IMetricsParams} from "../../../metrics/Metrics";

export class MetricsRepository extends BulkRepository<Metrics> {
    public constructor(config: IBeaconConfig, db: IDatabaseController) {
        super(config, db, JSONSerializer, Bucket.generalMetrics, SZMetrics);
    }

    public store(params: IMetricsParams, metrics: Metrics): Promise<void> {
        const id = generateMetricsKey(metrics.date, metrics.method, params.instanceId);

        return this.set(encodeKey(params.bucket, id), metrics);
    }
}


export function generateMetricsKey(date: string, method: string, instanceId: string): string{
    return `${instanceId}-${date}-${method}`;
}