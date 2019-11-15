import Joi from "@hapi/joi";
import {trimHex} from "../../../services/validation/trim-hex";
import {isPublicKeyLength} from "../../../services/validation/key";
import {PUBLIC_KEY_LENGTH} from "@chainsafe/bls/lib/constants";

export const KEY_NOT_STRING_MESSAGE="Value must be type of string";
export const KEY_START_WITH_PREFIX_MESSAGE="Key must have '0x' prefix";
export const KEY_WRONG_CHARACTERS_MESSAGE = "Private key must contain hex characters only";
export const PUBLIC_KEY_WRONG_LENGTH_MESSAGE = `Public key should have ${PUBLIC_KEY_LENGTH} bytes`;

export const publicKeySchema = Joi
    .string()
    .custom(trimHex)
    .hex()
    .custom(isPublicKeyLength)
    .messages({
        "string.base": KEY_NOT_STRING_MESSAGE,
        "custom.thex": KEY_START_WITH_PREFIX_MESSAGE,
        "string.hex": KEY_WRONG_CHARACTERS_MESSAGE,
        "key.invalid": PUBLIC_KEY_WRONG_LENGTH_MESSAGE
    });