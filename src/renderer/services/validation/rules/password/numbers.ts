import {CustomHelpers, ExtensionRule, SchemaInternals} from "@hapi/joi";

export const ERR_CODE_NUM_OF_NUMBERS = "password.numbers";

const joiNumberOfNumbers: ExtensionRule & ThisType<SchemaInternals> = {
    alias: "numOfNumbers",
    method(n: number): any {
        // @ts-ignore
        return this.$_addRule({name: "numbers", args: {n}});
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
        const numericCount = (value.match(/[0-9]/g) || []).length;
        if (numericCount >= args.n) { return value; }
        return helpers.error(ERR_CODE_NUM_OF_NUMBERS, {n: args.n});
    }
};

export const numberRule = {
    numbers: joiNumberOfNumbers
};
