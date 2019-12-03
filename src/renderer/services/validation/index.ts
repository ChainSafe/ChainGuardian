import * as joi from "@hapi/joi";
import {passwordExtension} from "./rules/password";
import {cryptoExtension} from "./rules/crypto";

/**
 * Crypto extension:
 *
 * Validation of public/private keys and mnemonic.
 *
 * Joi.crypto()
 *      .key(type: string)      // stripes 0x prefix anf validates "public" or "private" type of key
 *      .mnemonic()             // validates mnemonic
 *
 * Error codes:
 *      crypto()
 *          - string.empty
 *      key()
 *          - crypto.key.not.hex
 *          - crypto.key.public.invalid
 *          - crypto.key.private.invalid
 *      mnemonic()
 *          - crypto.mnemonic.invalid
 *
 * ----------------------------------------------------------------
 *
 * Password extension:
 *
 * Validation of password complexity.
 *
 * Joi.password()
 *      .min(n: number)         // validates minimal length of password
 *      .max(n: number)         // validates maximal length of password
 *      .numOfUpper(n: number)  // validates if minimal number (n) of upper case characters in password
 *      .numOfLower(n: number)  // validates if minimal number (n) of lower case characters in password
 *      .numOfSigns(n: number)  // validates if minimal number (n) of sign characters in password
 *      .numOfNums(n: number)   // validates if minimal number (n) of numeric characters in password
 *
 *
 * Error codes:
 *      password()
 *          - string.empty
 *      min()
 *          - string.min
 *      max()
 *          - string.max
 *      numOfUpper()
 *          - complexity.upper
 *      numOfLower()
 *          - complexity.lower
 *      numOfSigns()
 *          - complexity.signs
 *      numOfNums()
 *          - complexity.numbers
 */
export const Joi = joi.extend(
    passwordExtension,
    cryptoExtension
);
