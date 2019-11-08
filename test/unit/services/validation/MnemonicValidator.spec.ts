import {mnemonicValidator} from "../../../../src/renderer/services/validators/MnemonicValidator";

describe("Joi custom mnemonic schema unit tests.", () => {
    it("should validate valid mnemonic", async () => {
        const result = mnemonicValidator
        // eslint-disable-next-line max-len
            .validate("hard caught annual spread green step avocado shine scare warm chronic pond");
        expect(result.error).toBeUndefined();
    });

    it("should fail because invalid mnemonic", async () => {
        const result = mnemonicValidator
            .validate("fake attempt red");
        expect(result.error).toBeDefined();
    });
});