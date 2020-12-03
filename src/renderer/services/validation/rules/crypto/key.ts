import {CustomHelpers, ExtensionRule, SchemaInternals} from "joi";
import {isValidKeyLength} from "./util";

export const ERR_CODE_KEY = "crypto.key.not.hex";
export const ERR_CODE_PUBLIC_KEY = "crypto.key.public.invalid";
export const ERR_CODE_PRIVATE_KEY = "crypto.key.private.invalid";

const joiKey: ExtensionRule & ThisType<SchemaInternals> = {
    alias: "key",
    method(type: "public" | "private"): any {
        // @ts-ignore
        return this.$_addRule({name: "key", args: {type}});
    },
    args: [
        {
            name: "type",
            ref: true,
            assert: (value: any): boolean => typeof value === "string" && value.length != 0,
            message: "must be a string",
        },
    ],
    validate(value: string, helpers: CustomHelpers, args: Record<string, any>): any {
        // check if hex value
        if (!/^[0-9a-fA-F]+$/.test(value)) return helpers.error(ERR_CODE_KEY);
        // check if valid key size
        if (!isValidKeyLength(value, args.type))
            return helpers.error(args.type === "private" ? ERR_CODE_PRIVATE_KEY : ERR_CODE_PUBLIC_KEY);
        // value validated
        return value;
    },
};

export const keyRule = {
    key: joiKey,
};
