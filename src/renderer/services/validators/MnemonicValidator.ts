import {validateMnemonic} from "bip39";
import Joi, {CustomHelpers, ErrorReport} from "@hapi/joi";

/**
 * Custom Joi validation that checks if value is prefixed with 0x and then removes prefix.
 */
export function isValidMnemonic(value: string, helpers: CustomHelpers): string | ErrorReport {
    return validateMnemonic(value) ? value : helpers.error("check mnemonic");
}

export const mnemonicValidator = Joi
    .string()
    .custom(isValidMnemonic, "check if prefix and trim");