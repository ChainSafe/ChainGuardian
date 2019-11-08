import {
    KEY_NOT_STRING_MESSAGE, KEY_START_WITH_PREFIX_MESSAGE,
    KEY_WRONG_CHARACTERS_MESSAGE,
    keySchema
} from "../../../../../src/renderer/services/validation/schemas/KeySchema";
import {publicKeySchema} from "../../../../../src/renderer/services/validation/schemas/PublicKeySchema";


describe("Joi custom key schema unit tests.", () => {
    it("should validate valid key", async () => {
        const result = keySchema
            .validate("0xd68ffdb8b9729cb02c5be506e9a2fad086746b4bdc2f50fb74d10ac8419c5259");
        expect(result.error).toBeUndefined();
    });

    it("should fail because key is not string value", async () => {
        const result = keySchema
            .validate(12345678);
        expect(result.error).toBeDefined();
        expect(result.error.message).toBe(KEY_NOT_STRING_MESSAGE);
    });

    it("should fail because key doesn't start with 0x prefix", async () => {
        const result = publicKeySchema
            .validate("d68ffdb8b9729cb02c5be506e9a2fad086746b4bdc2f50fb74d10ac8419c5259");
        expect(result.error).toBeDefined();
        expect(result.error.message).toBe(KEY_START_WITH_PREFIX_MESSAGE);
    });

    it("should fail because key is not valid hex value", async () => {
        const result = keySchema
            .validate("0xd68ZZdb8b9729cb02c5be506e9a2fad086746b4bdc2f50fb74d10ac8419c5259");
        expect(result.error).toBeDefined();
        expect(result.error.message).toBe(KEY_WRONG_CHARACTERS_MESSAGE);
    });
});
