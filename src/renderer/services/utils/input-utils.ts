import {validateMnemonic} from "bip39";
import {IInputValidity} from "../interfaces";

const PRIVATE_KEY_LENGTH = 32;
const PUBLIC_KEY_LENGTH = 48;

export const KEY_WRONG_CHARACTERS_MESSAGE = "Private key must contain hex characters only";
export const PRIVATE_KEY_WRONG_LENGTH_MESSAGE = `Private key should have ${PRIVATE_KEY_LENGTH} bytes`;
export const PUBLIC_KEY_WRONG_LENGTH_MESSAGE = `Public key should have ${PUBLIC_KEY_LENGTH} bytes`;
export const INVALID_MNEMONIC_MESSAGE = "Invalid mnemonic";
export const KEY_START_WITH_PREFIX="Key must have '0x' prefix";


interface IKeyValidity {
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
    const {wrongCharacters, wrongLength} = isKey ? isValidKey(input) : {} as IKeyValidity;
    const isInvalidMnemonic = !isKey && !validateMnemonic(input);

    // NOTE conditions array, easy to add another condition
    const signingKeyConditions = [
        {condition: wrongCharacters, value: generateReturnStatement(KEY_WRONG_CHARACTERS_MESSAGE)},
        {condition: wrongLength, value: generateReturnStatement(PRIVATE_KEY_WRONG_LENGTH_MESSAGE)},
        {condition: isInvalidMnemonic, value: generateReturnStatement(INVALID_MNEMONIC_MESSAGE)},
    ];

    return checkValidity(signingKeyConditions);
}

export function isValidPublicKey(input: string): IInputValidity {
    const isKey = input.startsWith("0x");
    const {wrongCharacters, wrongLength} = isKey ? isValidKey(input, false) : {} as IKeyValidity;


    // NOTE conditions array, easy to add another condition
    const withdrawalKeyConditions = [
        {condition: !isKey, value: generateReturnStatement(KEY_START_WITH_PREFIX)},
        {condition: wrongCharacters, value: generateReturnStatement(KEY_WRONG_CHARACTERS_MESSAGE)},
        {condition: wrongLength, value: generateReturnStatement(PUBLIC_KEY_WRONG_LENGTH_MESSAGE)}
    ];

    return checkValidity(withdrawalKeyConditions);
}

function checkValidity(conditions: any): IInputValidity{
    let returnStatement = generateReturnStatement("", true);

    for (let i = 0; i < conditions.length; i++) {
        if (conditions[i].condition) {
            returnStatement = conditions[i].value;
            break;
        }
    }

    return returnStatement;
}

function generateReturnStatement(message: string, isValid = false): IInputValidity {
    return {isValid, message};
}

function isValidKey(input: string, isPrivate = true): IKeyValidity {
    const key = input.split("0x")[1];
    const wrongCharacters = !key.match("^[a-fA-F0-9]*$");
    const byteLength = isPrivate ? PRIVATE_KEY_LENGTH : PUBLIC_KEY_LENGTH;
    const wrongLength = (Buffer.from(key, "hex").length !== byteLength);

    return {
        wrongCharacters,
        wrongLength
    };
}
