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
export function trackMetrics(): MethodDecorator {
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
            const id = `${String(propertyKey)}_${i++}`;
            // Save the time before the method execution
            startTime = performance.now();
            // Call the original method
            const result = originalMethod.apply(this, args);
            // Save the time after the method executed
            endTime = performance.now();

            /**
             * TODO: Implement metrics persistance
             * Save this "log" data into the DB
             */
            console.log(`method "${id}" took ${endTime - startTime}ms`);
            console.log(`\t args: ${JSON.stringify(args)}`);
            return result;
        };
        return descriptorCopy;
    };
}