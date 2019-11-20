import {CustomHelpers, ErrorReport} from "@hapi/joi";

/**
 * Custom Joi validation that checks if value is prefixed with 0x and then removes prefix.
 */
export function trimHex(value: string, helpers: CustomHelpers): string | ErrorReport {
    if (!value.toString().startsWith("0x")) {
        return helpers.error("custom.thex");
    }
    return value.toString().split("x")[1];
}