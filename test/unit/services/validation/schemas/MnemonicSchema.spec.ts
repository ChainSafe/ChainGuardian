import {
    MNEMONIC_INVALID_MESSAGE,
    MNEMONIC_NOT_STRING_MESSAGE,
    MnemonicSchema
} from "../../../../../src/renderer/services/validation/schemas";

describe("Joi custom mnemonic schema unit tests.", () => {
    it("should success valid mnemonic", async () => {
        const result = MnemonicSchema
        // eslint-disable-next-line max-len
            .validate("hard caught annual spread green step avocado shine scare warm chronic pond");
        expect(result.error).toBeUndefined();
    });

    it("should fail because mnemonic is not string value", async () => {
        const result = MnemonicSchema
            .validate(12345678);
        expect(result.error).toBeDefined();
        expect(result.error.message).toBe(MNEMONIC_NOT_STRING_MESSAGE);
    });

    it("should fail because mnemonic invalid", async () => {
        const result = MnemonicSchema
            .validate("fake attempt red");
        expect(result.error).toBeDefined();
        expect(result.error.message).toBe(MNEMONIC_INVALID_MESSAGE);
    });
});