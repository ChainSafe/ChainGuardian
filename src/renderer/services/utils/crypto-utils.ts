/**
 * Converts string / Buffer / BN to hex string prefixed with 0x.
 *
 * @param data - that is converted.
 */
export function toHexString(data: string | Buffer | bigint): string {
    let hexString: string;
    if (typeof data === "string") {
        hexString = data;
    } else if (typeof data === "bigint") {
        hexString = data.toString(16);
    } else {
        hexString = data.toString('hex');
    }
    return hexString.startsWith("0x") ? hexString : `0x${hexString}`;
}

export function eth1IdToEthersName(networkId: number): string {
    switch(networkId) {
        case 1: return "homestead";
        case 3: return "ropsten";
        case 4: return "rinkeby";
        case 42: return "kovan";
        default: return "homestead";
    }
}

