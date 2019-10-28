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

/**
 * Provides methods to convert amount defined in eth to wei / gwei.
 */
export const EthConverter = {
    toGwei,
    toWei
};

function toGwei(amountInEth: number): BN {
    return new BN("1000000000").mul(new BN(amountInEth));
}

function toWei(amountInEth: number): BN {
    return new BN("1000000000000000000").mul(new BN(amountInEth));
}