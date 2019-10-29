import BN from "bn.js";
import validate = WebAssembly.validate;

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
 * Provides methods to convert amounts from currencies defines as @{Currency}.
 */
export const EthConverter = {
    convert,
    convertEth,
    convertWei
};

export type Currency = "wei" | "kwei" | "babbage" | "femtoether" |
"mwei" | "lovelace" | "picoether" | "gwei" | "shannon" | "nanoether" |
"nano" | "szabo" | "microether" | "micro" | "finney" | "milliether" |
"milli" | "ether" | "eth" | "kether" | "grand" | "mether" | "gether" | "tether";

const units = {
    "wei":          new BN("1"),
    "kwei":         new BN("1000"),
    "babbage":      new BN("1000"),
    "femtoether":   new BN("1000"),
    "mwei":         new BN("1000000"),
    "lovelace":     new BN("1000000"),
    "picoether":    new BN("1000000"),
    "gwei":         new BN("1000000000"),
    "shannon":      new BN("1000000000"),
    "nanoether":    new BN("1000000000"),
    "nano":         new BN("1000000000"),
    "szabo":        new BN("1000000000000"),
    "microether":   new BN("1000000000000"),
    "micro":        new BN("1000000000000"),
    "finney":       new BN("1000000000000000"),
    "milliether":   new BN("1000000000000000"),
    "milli":        new BN("1000000000000000"),
    "ether":        new BN("1000000000000000000"),
    "eth":          new BN("1000000000000000000"),
    "kether":       new BN("1000000000000000000000"),
    "grand":        new BN("1000000000000000000000"),
    "mether":       new BN("1000000000000000000000000"),
    "gether":       new BN("1000000000000000000000000000"),
    "tether":       new BN("1000000000000000000000000000000")
};

const re = RegExp(/^[0-9]+\.?[0-9]*$/);

function convert(value: string, from: Currency, to: Currency): BN {
    if (!re.test(value)) {
        throw new Error("Unsupported value");
    }
    return new BN(value, 10).mul(units[from]).div(units[to]);
}

function convertEth(value: string, to: Currency): BN {
    return convert(value, "eth", to);
}

function convertWei(value: string, to: Currency): BN {
    return convert(value, "wei", to);
}