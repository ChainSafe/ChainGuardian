import {BulkRepository} from "../repository";
import {Bucket} from "../../schema";
import {IBeaconConfig} from "@chainsafe/eth2.0-config";
import {IDatabaseController} from "../../controller";
import {Metrics as SZMetrics} from "../../../../models/ssz/types";
import {JSONSerializer} from "../../serializers/json";
import {Metrics} from "../../../../models/metrics";

export class MetricsRepository extends BulkRepository<Metrics> {
    public constructor(config: IBeaconConfig, db: IDatabaseController) {
        super(config, db, JSONSerializer, Bucket.generalMetrics, SZMetrics);
    }
}


export function generateMetricsKey(date: Date, method: string, instanceId: string): string{
    return `${date.toISOString()}-${method}-${instanceId}`;
}