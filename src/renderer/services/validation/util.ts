import {PUBLIC_KEY_LENGTH, SECRET_KEY_LENGTH} from "@chainsafe/bls/lib/constants";
import {keySchema} from "./schemas/KeySchema";
import {privateKeySchema} from "./schemas/PrivateKeySchema";
import {mnemonicSchema} from "./schemas/MnemonicSchema";
import {StringSchema} from "@hapi/joi";

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

/**
 * Determines based on input if private key or mnemonic validation should be applied and returns appropriate schema.
 * @param input - string that is validated
 */
export function getPrivateKeyOrMnemonicSchema(input: string): StringSchema {
    return (input.startsWith("0x")) ? privateKeySchema : mnemonicSchema;
}