import { getDB } from "../db/api/database";
import { encodeKey, Bucket } from "../db/schema";
import { Metrics } from "../../models/metrics";

export function measureExecution<T>(instance: any, fn: Function, functionName: string, bucket: Bucket = Bucket.httpMetrics, ...args: any[]): T{
        const db = getDB();
        const start = performance.now();
        const res = fn.apply(instance, args);
        const end = performance.now();

        const currentDate = new Date();
        const metrics = new Metrics({
            metric: end - start,
            method: functionName,
            date: currentDate.toISOString(),
        });
        // YYYY-MM-DD-methodName-itearation
        const id = `${currentDate.toISOString()}-${functionName}`;
        // Save the metrics to the DB based on the provided Bucket
        db.metrics.set(
            encodeKey(bucket, id),
            metrics
        );
        return res;
}