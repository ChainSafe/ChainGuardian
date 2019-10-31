import {validateMnemonic} from "bip39";
import {IInputValidity} from "../interfaces";

export const KEY_WRONG_CHARACTERS_MESSAGE = "Private key must contain alphanumerical characters only";
export const KEY_WRONG_LENGTH_MESSAGE = "Private key should have 32 bytes";
export const INVALID_MNEMONIC_MESSAGE = "Invalid mnemonic";


/**
 * Method checks that input meets conditions
 * 
 * @param input private key or mnemonic
 */
export function checkValidity(input: string): IInputValidity {

    const isKey = input.startsWith("0x");

    const privateKey = input.split("0x")[1];
    const hasWrongCharacters = isKey && !privateKey.match("^[a-z0-9]*$");

    const wrongLength = isKey && (Buffer.from(privateKey, "hex").length !== 32);
    const isInvalidMnemonic = !isKey && !validateMnemonic(input);

    // NOTE conditions array, easy to add another condition
    const signingKeyConditions = [
        {condition: hasWrongCharacters, value: generateReturnStatement(false, KEY_WRONG_CHARACTERS_MESSAGE)},
        {condition: wrongLength, value: generateReturnStatement(false, KEY_WRONG_LENGTH_MESSAGE)},
        {condition: isInvalidMnemonic, value: generateReturnStatement(false, INVALID_MNEMONIC_MESSAGE)},
    ];

    let returnStatement = generateReturnStatement(true, "");

    for (let i = 0; i < signingKeyConditions.length; i++) {
        if (signingKeyConditions[i].condition) {
            returnStatement = signingKeyConditions[i].value;
            break;
        }
    }

    return returnStatement;
}

function generateReturnStatement(isValid: boolean, message: string): IInputValidity {
    return {isValid, message};
}
