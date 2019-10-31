import { validateMnemonic } from "bip39";
import { IInputValidity } from "../interfaces";

/**
 * Method checks that input meets conditions
 * 
 * @param input private key or mnemonic
 */
export function checkValidity(input: string): IInputValidity {

    const isKey = input.startsWith("0x")

    const privateKey = input.split("0x")[1];
    const hasWrongCharacters = isKey && !privateKey.match("^[a-z0-9]*$")

    const wrongLength = isKey && (Buffer.from(privateKey, "hex").length !== 32)
    const isInvalidMnemonic = !isKey && !validateMnemonic(input)

    // NOTE conditions array, easy to add another condition
    const signingKeyConditions = [
        { condition: hasWrongCharacters, value: generateReturnStatement(false, "Private key must contain alphanumerical characters only") },
        { condition: wrongLength, value: generateReturnStatement(false, "Private key should have 32 bytes") },
        { condition: isInvalidMnemonic, value: generateReturnStatement(false, "Invalid mnemonic") },
    ]

    let returnStatement = generateReturnStatement(true, "")

    for (var i = 0; i < signingKeyConditions.length; i++) {
        if (signingKeyConditions[i].condition) {
            returnStatement = signingKeyConditions[i].value
            break
        }
    }

    return returnStatement
}

function generateReturnStatement(isValid: boolean, message: string): IInputValidity {
    return { isValid, message };
}
