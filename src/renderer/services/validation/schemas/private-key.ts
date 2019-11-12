import {CustomHelpers, ErrorReport} from "@hapi/joi";
import {KeySchema} from "./index";
import {isValidKeyLength} from "../util";
import {SECRET_KEY_LENGTH} from "@chainsafe/bls/lib/constants";

/**
 * Custom Joi validation that checks if length of provided key is valid for private key.
 */
function isPrivateKeyLength(value: string, helpers: CustomHelpers): string | ErrorReport {
    return isValidKeyLength(value, "private") ? value : helpers.error("any.invalid");
}

export const PRIVATE_KEY_WRONG_LENGTH_MESSAGE = `Private key should have ${SECRET_KEY_LENGTH} bytes`;

export const schema = KeySchema
    .custom(isPrivateKeyLength, "Validate private key length")
    .message(PRIVATE_KEY_WRONG_LENGTH_MESSAGE);