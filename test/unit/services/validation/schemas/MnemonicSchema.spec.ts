import {
    MNEMONIC_INVALID_MESSAGE,
    MNEMONIC_NOT_STRING_MESSAGE,
    mnemonicSchema
} from "../../../../../src/renderer/services/validation/schemas/MnemonicSchema";
import * as Joi from '@hapi/joi';
import { privateKeySchema } from '../../../../../src/renderer/services/validation/schemas/PrivateKeySchema';
import { keySchema } from '../../../../../src/renderer/services/validation/schemas/KeySchema';
import { publicKeySchema } from '../../../../../src/renderer/services/validation/schemas/PublicKeySchema';
import validate = WebAssembly.validate;

describe("Joi custom mnemonic schema unit tests.", () => {
    it("should success valid mnemonic", async () => {
        const result = mnemonicSchema
        // eslint-disable-next-line max-len
            .validate("hard caught annual spread green step avocado shine scare warm chronic pond");
        expect(result.error).toBeUndefined();
    });

    it("should fail because mnemonic is not string value", async () => {
        const result = mnemonicSchema
            .validate(12345678);
        expect(result.error).toBeDefined();
        expect(result.error.message).toBe(MNEMONIC_NOT_STRING_MESSAGE);
    });

    it("should fail because mnemonic invalid", async () => {
        const result = mnemonicSchema
            .validate("fake attempt red");
        expect(result.error).toBeDefined();
        expect(result.error.message).toBe(MNEMONIC_INVALID_MESSAGE);
    });
});