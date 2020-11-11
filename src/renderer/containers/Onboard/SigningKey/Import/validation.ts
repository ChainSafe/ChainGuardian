import {Joi} from "../../../../services/validation";
import {StringSchema} from "@hapi/joi";
import {SECRET_KEY_LENGTH} from "@chainsafe/bls/lib/constants";

export const PRIVATE_KEY_NOT_STRING_MESSAGE = "Value must be non empty string";
export const PRIVATE_KEY_WRONG_CHARACTERS_MESSAGE = "Private key must contain hex characters only";
export const PRIVATE_KEY_WRONG_LENGTH_MESSAGE = `Private key should have ${SECRET_KEY_LENGTH * 2} characters`;

export const privateKeySchema = Joi.crypto().key("private").messages({
    "string.empty": PRIVATE_KEY_NOT_STRING_MESSAGE,
    "crypto.key.not.hex": PRIVATE_KEY_WRONG_CHARACTERS_MESSAGE,
    "crypto.key.private.invalid": PRIVATE_KEY_WRONG_LENGTH_MESSAGE,
}) as StringSchema;

export const MNEMONIC_NOT_STRING_MESSAGE = "Value must be type of string";
export const MNEMONIC_INVALID_MESSAGE = "Invalid mnemonic";

export const mnemonicSchema = Joi.crypto().mnemonic().messages({
    "string.empty": MNEMONIC_NOT_STRING_MESSAGE,
    "crypto.mnemonic.invalid": MNEMONIC_INVALID_MESSAGE,
}) as StringSchema;
