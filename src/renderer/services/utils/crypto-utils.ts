import BN from "bn.js";

/**
 * Converts string / Buffer / BN to hex string prefixed with 0x.
 *
 * @param data - that is converted.
 */
export function toHexString(data: string | Buffer | BN): string {
    const hexString: string = (typeof data === "string") ? data : data.toString("hex");
    return hexString.startsWith("0x") ? hexString : `0x${hexString}`;
}