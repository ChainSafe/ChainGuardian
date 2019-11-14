import {getDB} from "../db/api/database";
import {Bucket} from "../db/schema";
import {Metrics} from "../../models/metrics";

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
    
    db.metrics.store(params, metrics);

    return res;
}