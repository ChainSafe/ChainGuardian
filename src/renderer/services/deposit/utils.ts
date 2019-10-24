import BN from "bn.js";

export function functionSignatureFromABI(abi: (string | any)[] | string, functionName: string): string {
    let functionSignature = "";
    let hasFunction = false;
    const inputs: string[] = [];
    for (const field of abi) {
        if (field["type"] === "function") {
            if (field["name"] === functionName) {
                hasFunction = true;
                for (const input of field["inputs"]) {
                    inputs.push(input["type"]);
                }
            }
        }
    }
    if (hasFunction) {
        functionSignature = `${functionName}(${inputs.join(",")})`;
    }
    return functionSignature;
}

export function toHexString(data: string | Buffer | BN): string {
    const hexString: string = (typeof data === "string") ? data : data.toString("hex");
    return hexString.startsWith("0x") ? hexString : `0x${hexString}`;
}

export function toGwei(amountInEth: number): BN {
    return new BN("1000000000").mul(new BN(amountInEth));
}

export function toWei(amountInEth: number): BN {
    return new BN("1000000000000000000").mul(new BN(amountInEth));
}
