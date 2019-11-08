import {CustomHelpers, ErrorReport} from "@hapi/joi";
import {keySchema} from "./KeySchema";
import {isValidKeyLength} from "./util";

function isPublicKeyLength(value: string, helpers: CustomHelpers): string | ErrorReport {
    return isValidKeyLength(value, "public") ? value : helpers.error("any.invalid");
}

export const publicKeyValidator = keySchema
    .custom(isPublicKeyLength, "check if ");