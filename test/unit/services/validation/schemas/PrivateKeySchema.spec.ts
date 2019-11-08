import {
    PRIVATE_KEY_WRONG_LENGTH_MESSAGE,
    privateKeySchema
} from "../../../../../src/renderer/services/validation/schemas/PrivateKeySchema";
import {
    KEY_NOT_STRING_MESSAGE,
    KEY_START_WITH_PREFIX_MESSAGE, KEY_WRONG_CHARACTERS_MESSAGE
} from "../../../../../src/renderer/services/validation/schemas/KeySchema";

describe("Joi custom private key schema unit tests.", () => {
    it("should success valid private key", async () => {
        const result = privateKeySchema
            .validate("0xd68ffdb8b9729cb02c5be506e9a2fad086746b4bdc2f50fb74d10ac8419c5259");
        expect(result.error).toBeUndefined();
    });

    it("should fail because key length", async () => {
        const result = privateKeySchema
            .validate("0x8ffdb8b97");
        expect(result.error).toBeDefined();
        expect(result.error.message).toBe(PRIVATE_KEY_WRONG_LENGTH_MESSAGE);
    });

    it("should fail because private key is not string value", async () => {
        const result = privateKeySchema
        // eslint-disable-next-line max-len
            .validate(12345678);
        expect(result.error).toBeDefined();
        expect(result.error.message).toBe(KEY_NOT_STRING_MESSAGE);
    });

    it("should fail because private key doesn't start with 0x prefix", async () => {
        const result = privateKeySchema
            .validate("d68ffdb8b9729cb02c5be506e9a2fad086746b4bdc2f50fb74d10ac8419c5259");
        expect(result.error).toBeDefined();
        expect(result.error.message).toBe(KEY_START_WITH_PREFIX_MESSAGE);
    });

    it("should fail because private key is not valid hex value", async () => {
        const result = privateKeySchema
            .validate("0xd68ZZdb8b9729cb02c5be506e9a2fad086746b4bdc2f50fb74d10ac8419c5259");
        expect(result.error).toBeDefined();
        expect(result.error.message).toBe(KEY_WRONG_CHARACTERS_MESSAGE);
    });
});
