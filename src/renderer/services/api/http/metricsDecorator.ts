import {Bucket, encodeKey} from "../../db/schema";
import {CGDatabase} from "../../db/api";
import {Metrics} from "../../../models/metrics";

/**
 * Decorator that allows us to track metrics of any method.
 * It measures the execution time and persists this metric.
 * 
 * Example usage:
 * 
 * class Example{
 *  
 *  @trackMetrics()
 *  method(){
 *      console.log("Do the hard work");
 *  }
 * }
 */
export function trackMetrics(persistMetrics = false, bucket: Bucket = Bucket.generalMetrics): MethodDecorator {
    return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor): any {
        let descriptorCopy = descriptor;
        if (descriptorCopy === undefined) {
            // @ts-ignore
            descriptorCopy = Object.getOwnPropertyDescriptor(target, propertyKey);
        }
        const originalMethod = descriptorCopy.value;
        // TODO: Inject database instance
        let db: CGDatabase;

        // Counter to track the number of times the method was executed
        let i = 0;
        let startTime = 0, endTime = 0;
        descriptorCopy.value = function (...args: any[]): any {
            // Save the time before the method execution
            startTime = performance.now();
            // Call the original method
            const result = originalMethod.apply(this, args);
            // Save the time after the method executed
            endTime = performance.now();

            const currentDate = new Date();
            const metrics = new Metrics({
                metric: endTime - startTime,
                date: currentDate.toISOString(),
            });
            // YYYY-MM-DD-methodName-itearation
            const id = `${currentDate.toISOString()}-${String(propertyKey)}-${i++}`;
            /**
             * TODO: Implement metrics persistance
             * Save this "log" data into the DB
             */
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