import {PUBLIC_KEY_LENGTH} from "@chainsafe/bls/lib/constants";
import {Joi} from "../../../../services/validation";
import {StringSchema} from "@hapi/joi";

export const PUBLIC_KEY_NOT_STRING_MESSAGE="Public key is empty string";
export const PUBLIC_KEY_WRONG_CHARACTERS_MESSAGE = "Public key must contain hex characters only";
export const PUBLIC_KEY_WRONG_LENGTH_MESSAGE = `Public key must have ${PUBLIC_KEY_LENGTH*2} characters`;

export const publicKeySchema: StringSchema = Joi
    .crypto()
    .key("public")
    .messages({
        "string.empty": PUBLIC_KEY_NOT_STRING_MESSAGE,
        "crypto.key.not.hex": PUBLIC_KEY_WRONG_CHARACTERS_MESSAGE,
        "crypto.key.public.invalid": PUBLIC_KEY_WRONG_LENGTH_MESSAGE
    });