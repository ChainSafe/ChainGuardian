import {validateMnemonic} from "bip39";
import {IInputValidity} from "../interfaces";

export const KEY_WRONG_CHARACTERS_MESSAGE = "Private key must contain hex characters only";
export const KEY_WRONG_LENGTH_MESSAGE = "Private key should have 32 bytes";
export const INVALID_MNEMONIC_MESSAGE = "Invalid mnemonic";

interface IPrivateKeyValidity {
    wrongCharacters: boolean,
    wrongLength: boolean
}

/**
 * Method checks that input meets conditions
 * 
 * @param input private key or mnemonic
 */
export function isValidMnemonicOrPrivateKey(input: string): IInputValidity {

    const isKey = input.startsWith("0x");

    const {wrongCharacters, wrongLength} = isKey ? isValidPrivateKey(input) : {} as IPrivateKeyValidity;
    const isInvalidMnemonic = !isKey && !validateMnemonic(input);

    // NOTE conditions array, easy to add another condition
    const signingKeyConditions = [
        {condition: wrongCharacters, value: generateReturnStatement(KEY_WRONG_CHARACTERS_MESSAGE)},
        {condition: wrongLength, value: generateReturnStatement(KEY_WRONG_LENGTH_MESSAGE)},
        {condition: isInvalidMnemonic, value: generateReturnStatement(INVALID_MNEMONIC_MESSAGE)},
    ];

    let returnStatement = generateReturnStatement("", true);

    for (let i = 0; i < signingKeyConditions.length; i++) {
        if (signingKeyConditions[i].condition) {
            returnStatement = signingKeyConditions[i].value;
            break;
        }
    }

    return returnStatement;
}

function generateReturnStatement(message: string, isValid = false): IInputValidity {
    return {isValid, message};
}

function isValidPrivateKey(input: string): IPrivateKeyValidity {
    const privateKey = input.split("0x")[1];
    const wrongCharacters = !privateKey.match("^[a-fA-F0-9]*$");
    const wrongLength = (Buffer.from(privateKey, "hex").length !== 32);

    return {
        wrongCharacters,
        wrongLength
    };
}
