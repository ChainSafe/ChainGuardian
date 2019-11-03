import {Bucket, encodeKey} from "../../db/schema";
import {CGDatabase} from "../../db/api";
import {Metrics} from "../../../models/metrics";
import {getDB} from "../../db/api/database";

/**
 * Decorator that allows us to track metrics of any method.
 * It measures the execution time and persists this metric.
 * 
 * Example usage:
 * 
 * class Example{
 *  
 *  @trackMetrics(true, Bucket.example)
 *  method(){
 *      console.log("Do the hard work");
 *  }
 * }
 */
export function trackMetrics(persistMetrics = true, bucket: Bucket = Bucket.generalMetrics): MethodDecorator {
    return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor): any {
        let descriptorCopy = descriptor;
        if (descriptorCopy === undefined) {
            // @ts-ignore
            descriptorCopy = Object.getOwnPropertyDescriptor(target, propertyKey);
        }
        const originalMethod = descriptorCopy.value;

        // Counter to track the number of times the method was executed
        let i = 0;
        let startTime = 0, endTime = 0;
        descriptorCopy.value = function (...args: any[]): any {
            // TODO: Inject database instance
            const db: CGDatabase = getDB();
            // Save the time before the method execution
            startTime = performance.now();
            // Call the original method
            const result = originalMethod.apply(this, args);
            // Save the time after the method executed
            endTime = performance.now();

            const currentDate = new Date();
            const metrics = new Metrics({
                metric: endTime - startTime,
                method: String(propertyKey),
                date: currentDate.toISOString(),
            });
            // YYYY-MM-DD-methodName-itearation
            const id = `${currentDate.toISOString()}-${String(propertyKey)}-${i++}`;
            // Save the metrics to the DB based on the provided Bucket
            if(persistMetrics === true){
                switch(bucket){
                    case Bucket.httpMetrics:
                        db.httpMetrics.set(
                            encodeKey(Bucket.httpMetrics, id),
                            metrics
                        );
                        break;
                }
            }
            console.log(`"${id}" took ${endTime - startTime}ms`);
            return result;
        };
        return descriptorCopy;
    };
}