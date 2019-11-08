import {
    PUBLIC_KEY_WRONG_LENGTH_MESSAGE,
    publicKeySchema
} from "../../../../../src/renderer/services/validation/schemas/PublicKeySchema";
import {
    KEY_NOT_STRING_MESSAGE,
    KEY_START_WITH_PREFIX_MESSAGE, KEY_WRONG_CHARACTERS_MESSAGE
} from "../../../../../src/renderer/services/validation/schemas/KeySchema";

describe("Joi custom public key schema unit tests.", () => {
    it("should success valid public key", async () => {
        const result = publicKeySchema
        // eslint-disable-next-line max-len
            .validate("0x92fffcc44e690220c190be41378baf6152560eb13fa73bdf8b45120b56096acc4b4e87a0e0b97f83e48f0ff4990daa18");
        expect(result.error).toBeUndefined();
    });

    it("should fail because public key length invalid", async () => {
        const result = publicKeySchema
            .validate("0x8ffdb8b97");
        expect(result.error).toBeDefined();
        expect(result.error.message).toBe(PUBLIC_KEY_WRONG_LENGTH_MESSAGE);
    });

    it("should fail because public key is not string value", async () => {
        const result = publicKeySchema
        // eslint-disable-next-line max-len
            .validate(12345678);
        expect(result.error).toBeDefined();
        expect(result.error.message).toBe(KEY_NOT_STRING_MESSAGE);
    });

    it("should fail because public key doesn't start with 0x prefix", async () => {
        const result = publicKeySchema
        // eslint-disable-next-line max-len
            .validate("92fffcc44e690220c190be41378baf6152560eb13fa73bdf8b45120b56096acc4b4e87a0e0b97f83e48f0ff4990daa18");
        expect(result.error).toBeDefined();
        expect(result.error.message).toBe(KEY_START_WITH_PREFIX_MESSAGE);
    });

    it("should fail because public key is not valid hex value", async () => {
        const result = publicKeySchema
        // eslint-disable-next-line max-len
            .validate("0x92ZZfcc44e690220c190be41378baf6152560eb13fa73bdf8b45120b56096acc4b4e87a0e0b97f83e48f0ff4990daa18");
        expect(result.error).toBeDefined();
        expect(result.error.message).toBe(KEY_WRONG_CHARACTERS_MESSAGE);
    });
});