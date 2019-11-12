import {getPrivateKeyOrMnemonicSchema, isValidKeyLength} from "../../../../src/renderer/services/validation/util";
import {
    MNEMONIC_INVALID_MESSAGE,
    PRIVATE_KEY_WRONG_LENGTH_MESSAGE
} from "../../../../src/renderer/services/validation/schemas";


describe("Validation utils unit tests", () => {
    it("should return true for valid private key", async () => {
        const result = isValidKeyLength(
            "d68ffdb8b9729cb02c5be506e9a2fad086746b4bdc2f50fb74d10ac8419c5259",
            "private"
        );
        expect(result).toBeTruthy();
    });

    it("should return true for valid public key", async () => {
        const result = isValidKeyLength(
            "92fffcc44e690220c190be41378baf6152560eb13fa73bdf8b45120b56096acc4b4e87a0e0b97f83e48f0ff4990daa18",
            "public"
        );
        expect(result).toBeTruthy();
    });

    it("should return false for invalid private key", async () => {
        const result = isValidKeyLength(
            "0x92fffcc44e690220c190be41378baf6152560eb13fa73bdf8b45120b56096acc4b4e87a0e0b97f83e48f0ff4990daa18",
            "private"
        );
        expect(result).toBeFalsy();
    });

    it("should return false for invalid public key", async () => {
        const result = isValidKeyLength(
            "0xd68ffdb8b9729cb02c5be506e9a2fad086746b4bdc2f50fb74d10ac8419c5259",
            "public"
        );
        expect(result).toBeFalsy();
    });

    it("should return private key schema if input starts with 0x", function() {
        const input = "0xa32a";
        const result = getPrivateKeyOrMnemonicSchema(input).validate(input);
        expect(result.error).toBeDefined();
        expect(result.error.message).toBe(PRIVATE_KEY_WRONG_LENGTH_MESSAGE);
    });

    it("should return mnemonic schema if input doesn't start with 0x", function() {
        const input = "fake mnemonic";
        const result = getPrivateKeyOrMnemonicSchema(input).validate(input);
        expect(result.error).toBeDefined();
        expect(result.error.message).toBe(MNEMONIC_INVALID_MESSAGE);
    });
});
