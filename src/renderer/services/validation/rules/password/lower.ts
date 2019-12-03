import {CustomHelpers, ExtensionRule, SchemaInternals} from "@hapi/joi";

export const ERR_CODE_NUM_OF_LOWER = "complexity.lower";

const joiNumberOfLowerCase: ExtensionRule & ThisType<SchemaInternals> = {
    alias: "numOfLower",
    method(n: number): any {
        // @ts-ignore
        return this.$_addRule({name: "lower", args: {n}});
    },
    args: [
        {
            name: "n",
            ref: true,
            assert: (value: any): boolean => typeof value === "number" && !isNaN(value),
            message: "must be a number"
        }
    ],
    validate(value: string, helpers: CustomHelpers, args: Record<string, any>): any {
        const lowercaseCount = (value.match(/[a-z]/g) || []).length;
        if (lowercaseCount >= args.n) { return value; }
        return helpers.error(ERR_CODE_NUM_OF_LOWER, {n: args.n});
    }
};

export const lowerRule = {
    lower: joiNumberOfLowerCase
};
