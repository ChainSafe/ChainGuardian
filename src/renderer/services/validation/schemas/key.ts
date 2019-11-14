import Joi, {CustomHelpers, ErrorReport} from "@hapi/joi";

/**
 * Custom Joi validation that checks if value is prefixed with 0x and then removes prefix.
 */
function trimHex(value: string, helpers: CustomHelpers): string | ErrorReport {
    if (!value.toString().startsWith("0x")) {
        return helpers.error("string.startHex");
    }
    return value.toString().split("x")[1];
}

export const KEY_NOT_STRING_MESSAGE="Key must be type of string";
export const KEY_START_WITH_PREFIX_MESSAGE="Key must have '0x' prefix";
export const KEY_WRONG_CHARACTERS_MESSAGE = "Private key must contain hex characters only";

export const KeySchema = Joi
    .string()
    .custom(trimHex, "Validate if prefix 0x and trim")
    .hex()
    .messages({
        "string.base": KEY_NOT_STRING_MESSAGE,
        "string.startHex": KEY_START_WITH_PREFIX_MESSAGE,
        "string.hex": KEY_WRONG_CHARACTERS_MESSAGE
    });