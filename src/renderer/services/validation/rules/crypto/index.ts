import {CoerceResult, CustomHelpers, default as Joi, Extension} from "@hapi/joi";
import {mnemonicRule} from "./mnemonic";
import {keyRule} from "./key";

export const cryptoExtension = (joi: Joi.Root): Extension => ({
    base: joi.string(),
    type: "crypto",
    coerce: {
        from: "string",
        method(value: any, helpers: CustomHelpers): CoerceResult {
            const key = helpers.schema.$_getRule("key");
            if (key && value.toString().startsWith("0x")) {
                return {value: value.toString().split("x")[1]};
            }
            return {value};
        },
    },
    rules: {
        ...keyRule,
        ...mnemonicRule,
    },
});
