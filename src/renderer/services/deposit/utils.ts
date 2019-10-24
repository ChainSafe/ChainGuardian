/**
 * Generate function signature from ABI object.
 *
 * If function is not defined in ABI, empty string will be returned.
 *
 * @param rawAbi - array of objects or string defining contract ABI.
 * @param functionName - name of function for which signature is generated.
 * @return signature of function in format: functionName(arg1_type,arg2_type)
 */
export function functionSignatureFromABI(rawAbi: (string | any)[] | string, functionName: string): string {
    let hasFunction = false;
    const inputs: string[] = [];
    const abi = (typeof rawAbi == "string") ? JSON.parse(rawAbi) : rawAbi;
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
    return hasFunction ? `${functionName}(${inputs.join(",")})` : "";
}
