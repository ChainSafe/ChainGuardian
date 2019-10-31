export function trackMetrics(): MethodDecorator {
    return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor): any {
        let descriptorCopy = descriptor;
        if (descriptorCopy === undefined) {
            // @ts-ignore
            descriptorCopy = Object.getOwnPropertyDescriptor(target, propertyKey);
        }
        const originalMethod = descriptorCopy.value;
        let i = 0;
        let startTime = 0, endTime = 0;
        descriptorCopy.value = function (...args: any[]): any {
            const id = `${String(propertyKey)}_${i++}`;
            startTime = performance.now();
            const result = originalMethod.apply(this, args);
            endTime = performance.now();

            console.log(`method "${id}" took ${endTime - startTime}ms`);
            console.log(`\t args: ${JSON.stringify(args)}`);
            return result;
        };
        return descriptorCopy;
    };
}