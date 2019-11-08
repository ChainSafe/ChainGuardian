import {CustomHelpers, ErrorReport} from "@hapi/joi";
import {keySchema} from "./KeySchema";
import {isValidKeyLength} from "./util";

function isPrivateKeyLength(value: string, helpers: CustomHelpers): string | ErrorReport {
    return isValidKeyLength(value, "private") ? value : helpers.error("any.invalid");
}

export const privateKeyValidator = keySchema
    .custom(isPrivateKeyLength, "check if ");