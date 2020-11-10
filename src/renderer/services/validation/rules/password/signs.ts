import {CustomHelpers, ExtensionRule, SchemaInternals} from "@hapi/joi";

export const ERR_CODE_NUM_OF_SIGNS = "complexity.signs";

const joiNumberOfSigns: ExtensionRule & ThisType<SchemaInternals> = {
    alias: "numOfSigns",
    method(n: number): any {
        // @ts-ignore
        return this.$_addRule({name: "signs", args: {n}});
    },
    args: [
        {
            name: "n",
            ref: true,
            assert: (value: any): boolean => typeof value === "number" && !isNaN(value),
            message: "must be a number",
        },
    ],
    validate(value: string, helpers: CustomHelpers, args: Record<string, any>): any {
        const symbolCount = (value.match(/[^a-zA-Z0-9]/g) || []).length;
        if (symbolCount >= args.n) {
            return value;
        }
        return helpers.error(ERR_CODE_NUM_OF_SIGNS, {n: args.n});
    },
};

export const signsRule = {
    signs: joiNumberOfSigns,
};
