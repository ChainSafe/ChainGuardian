import {validateMnemonic} from "bip39";
import {CustomHelpers, ErrorReport} from "@hapi/joi";

/**
 * Custom Joi validation that checks provided mnemonic is valid.
 */
export function validMnemonic(value: string, helpers: CustomHelpers): string | ErrorReport {
    return validateMnemonic(value) ? value : helpers.error("mnemonic.invalid");
}