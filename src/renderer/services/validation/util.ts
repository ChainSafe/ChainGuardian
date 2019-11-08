import {PUBLIC_KEY_LENGTH, SECRET_KEY_LENGTH} from "@chainsafe/bls/lib/constants";

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
export function isValidKeyLength(key: string, keyType: "private" | "public"): boolean {
    const expectedKeyLength = (keyType === "public") ? PUBLIC_KEY_LENGTH : SECRET_KEY_LENGTH;
    return Buffer.from(key, "hex").length === expectedKeyLength;
}