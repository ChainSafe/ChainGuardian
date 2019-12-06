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

export function getV4Filename(timestamp?: number): string {
    const ts = timestamp ? new Date(timestamp) : new Date();
    return ["UTC--", ts.toJSON().replace(/:/g, "-"), "--", "uuid"].join("");
}