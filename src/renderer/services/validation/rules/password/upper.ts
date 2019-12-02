import {CustomHelpers, ExtensionRule, SchemaInternals} from "@hapi/joi";

export const ERR_CODE_NUM_OF_UPPER = "password.upper";

const joiNumberOfUpperCase: ExtensionRule & ThisType<SchemaInternals> = {
    alias: "numOfUpper",
    method(n: number): any {
        // @ts-ignore
        return this.$_addRule({name: "upper", args: {n}});
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
        const upperCaseCount = (value.match(/[A-Z]/g) || []).length;
        if (upperCaseCount >= args.n) { return value; }
        return helpers.error(ERR_CODE_NUM_OF_UPPER, {n: args.n});
    }
};

export const upperRule = {
    upper: joiNumberOfUpperCase
};
