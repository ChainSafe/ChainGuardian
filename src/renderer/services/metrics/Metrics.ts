import {getDB} from "../db/api/database";
import {encodeKey, Bucket} from "../db/schema";
import {Metrics} from "../../models/metrics";
import {generateMetricsKey} from "../db/api/repositories/metrics";

export interface IMetricsParams {
    instanceId: string,
    function: Function,
    functionName: string,
    bucket: Bucket,
}

export function measureExecution<T>(instance: any, params: IMetricsParams, ...args: any[]): T{
    const db = getDB();
    const start = performance.now();
    const res = params.function.apply(instance, args);
    const end = performance.now();

    const currentDate = new Date();
    const metrics = new Metrics({
        metric: end - start,
        method: params.functionName,
        date: currentDate.toISOString(),
    });
        // YYYY-MM-DD-methodName-instanceId
    const id = generateMetricsKey(currentDate, params.functionName, params.instanceId);
    // Save the metrics to the DB based on the provided Bucket
    db.metrics.set(
        encodeKey(params.bucket, id),
        metrics
    );
    return res;
}