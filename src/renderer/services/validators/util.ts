const PRIVATE_KEY_LENGTH = 32;
const PUBLIC_KEY_LENGTH = 48;

export function isValidKeyLength(key: string, keyType: "private" | "public"): boolean {
    const expectedKeyLength = (keyType === "public") ? PUBLIC_KEY_LENGTH : PRIVATE_KEY_LENGTH;
    return Buffer.from(key, "hex").length === expectedKeyLength;
}