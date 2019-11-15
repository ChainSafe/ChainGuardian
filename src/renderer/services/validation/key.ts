import {CustomHelpers, ErrorReport} from "@hapi/joi";

export const PUBLIC_KEY_LENGTH = 48;
export const SECRET_KEY_LENGTH = 32;

/**
 * Custom Joi validation that checks if length of provided key is valid for private key.
 */
export function isPrivateKeyLength(value: string, helpers: CustomHelpers): string | ErrorReport {
    return isValidKeyLength(value, "private") ? value : helpers.error("key.invalid");
}

/**
 * Custom Joi validation that checks if length of provided key is valid for public key.
 */
export function isPublicKeyLength(value: string, helpers: CustomHelpers): string | ErrorReport {
    return isValidKeyLength(value, "public") ? value : helpers.error("key.invalid");
}


/**
 * Checks if key length is valid based on key type (public/private).
 *
 * Expected key lenghts:
 * - private key: 32
 * - public key: 48
 *
 * @param key - string representation of key hex value without 0x prefix.
 * @param keyType - private || public
 */
function isValidKeyLength(key: string, keyType: "private" | "public"): boolean {
    const expectedKeyLength = (keyType === "public") ? PUBLIC_KEY_LENGTH : SECRET_KEY_LENGTH;
    return Buffer.from(key, "hex").length === expectedKeyLength;
}