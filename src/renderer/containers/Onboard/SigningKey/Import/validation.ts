import Joi from "@hapi/joi";
import {SECRET_KEY_LENGTH} from "@chainsafe/bls/lib/constants";
import {trimHex} from "../../../../services/validation/trim-hex";
import {privateKeyLength} from "../../../../services/validation/key";
import {validMnemonic} from "../../../../services/validation/mnemonic";

export const PRIVATE_KEY_NOT_STRING_MESSAGE="Value must be type of string";
export const PRIVATE_KEY_START_WITH_PREFIX_MESSAGE="Private key must have '0x' prefix";
export const PRIVATE_KEY_WRONG_CHARACTERS_MESSAGE = "Private key must contain hex characters only";
export const PRIVATE_KEY_WRONG_LENGTH_MESSAGE = `Private key should have ${SECRET_KEY_LENGTH} bytes`;

export const privateKeySchema = Joi
    .string()
    .custom(trimHex)
    .hex()
    .custom(privateKeyLength)
    .messages({
        "string.base": PRIVATE_KEY_NOT_STRING_MESSAGE,
        "custom.thex": PRIVATE_KEY_START_WITH_PREFIX_MESSAGE,
        "string.hex": PRIVATE_KEY_WRONG_CHARACTERS_MESSAGE,
        "key.invalid": PRIVATE_KEY_WRONG_LENGTH_MESSAGE
    });

export const MNEMONIC_NOT_STRING_MESSAGE="Value must be type of string";
export const MNEMONIC_INVALID_MESSAGE = "Invalid mnemonic";

export const mnemonicSchema = Joi
    .string()
    .custom(validMnemonic, "Validate mnemonic")
    .messages({
        "string.base": MNEMONIC_NOT_STRING_MESSAGE,
        "mnemonic.invalid": MNEMONIC_INVALID_MESSAGE
    });