import {validateMnemonic} from "bip39";
import Joi, {CustomHelpers, ErrorReport} from "@hapi/joi";

/**
 * Custom Joi validation that checks provided mnemonic is valid.
 */
function isValidMnemonic(value: string, helpers: CustomHelpers): string | ErrorReport {
    return validateMnemonic(value) ? value : helpers.error("mnemonic.invalid");
}

export const MNEMONIC_INVALID_MESSAGE = "Invalid mnemonic";
export const MNEMONIC_NOT_STRING_MESSAGE="Key must be type of string";

export const MnemonicSchema = Joi
    .string()
    .custom(isValidMnemonic, "Validate mnemonic")
    .messages({
        "string.base": MNEMONIC_NOT_STRING_MESSAGE,
        "mnemonic.invalid": MNEMONIC_INVALID_MESSAGE
    });