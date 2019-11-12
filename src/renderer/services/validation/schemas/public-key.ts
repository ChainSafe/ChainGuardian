import {CustomHelpers, ErrorReport} from "@hapi/joi";
import {KeySchema} from "./index";
import {isValidKeyLength} from "../util";
import {PUBLIC_KEY_LENGTH} from "@chainsafe/bls/lib/constants";

/**
 * Custom Joi validation that checks if length of provided key is valid for public key.
 */
function isPublicKeyLength(value: string, helpers: CustomHelpers): string | ErrorReport {
    return isValidKeyLength(value, "public") ? value : helpers.error("any.invalid");
}

export const PUBLIC_KEY_WRONG_LENGTH_MESSAGE = `Public key should have ${PUBLIC_KEY_LENGTH} bytes`;

export const schema = KeySchema
    .custom(isPublicKeyLength, "Validate public key length")
    .message(PUBLIC_KEY_WRONG_LENGTH_MESSAGE);