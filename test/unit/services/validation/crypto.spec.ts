import {Joi} from "../../../../src/renderer/services/validation";

// test data
const VALID_PUBLIC_KEY =
    "92fffcc44e690220c190be41378baf6152560eb13fa73bdf8b45120b56096acc4b4e87a0e0b97f83e48f0ff4990daa18";
const VALID_PRIVATE_KEY =
    "d68ffdb8b9729cb02c5be506e9a2fad086746b4bdc2f50fb74d10ac8419c5259";
const INVALID_KEY =
    "8ffdb8b97";
const VALID_MNEMONIC =
    "hard caught annual spread green step avocado shine scare warm chronic pond";
const INVALID_MNEMONIC =
    "fake attempt red";

// custom joi schemas
const publicKeySchema = Joi.crypto().key("public");
const privateKeySchema = Joi.crypto().key("private");
const mnemonicSchema = Joi.crypto().mnemonic();

describe("Joi custom crypto validation functions unit tests.", () => {

    it("should strip 0x prefix on key validation", () => {
        const v = publicKeySchema.validate(`0x${VALID_PUBLIC_KEY}`);
        expect(v.value).toBe(VALID_PUBLIC_KEY);
    });

    it("should success public key with valid key", () => {
        expect(publicKeySchema.validate(VALID_PUBLIC_KEY).error).toBeUndefined();
    });

    it("should fail public key with invalid key", () => {
        const validation = publicKeySchema.validate(INVALID_KEY);
        expect(validation.error).toBeDefined();
        expect(validation.error.details[0].type === "crypto.key.public.invalid");
    });

    it("should fail public key with invalid hex string", () => {
        const validation = publicKeySchema.validate("YT21PKL");
        expect(validation.error).toBeDefined();
        expect(validation.error.details[0].type === "crypto.key.not.hex");
    });

    it("should fail public key with empty string", () => {
        const validation = publicKeySchema.validate("");
        expect(validation.error).toBeDefined();
        expect(validation.error.details[0].type === "string.empty");
    });

    it("should success private key with valid key", () => {
        expect(privateKeySchema.validate(VALID_PRIVATE_KEY).error).toBeUndefined();
    });

    it("should fail private key with invalid key", () => {
        const validation = privateKeySchema.validate(INVALID_KEY);
        expect(validation.error).toBeDefined();
        expect(validation.error.details[0].type === "crypto.key.private.invalid");
    });

    it("should fail private key with invalid hex string", () => {
        const validation = privateKeySchema.validate("YT21PKL");
        expect(validation.error).toBeDefined();
        expect(validation.error.details[0].type === "crypto.key.not.hex");
    });

    it("should fail private key with empty string", () => {
        const validation = privateKeySchema.validate("");
        expect(validation.error).toBeDefined();
        expect(validation.error.details[0].type === "string.empty");
    });

    it("should success mnemonic with valid mnemonic", () => {
        expect(mnemonicSchema.validate(VALID_MNEMONIC).error).toBeUndefined();
    });

    it("should fail mnemonic with invalid mnemonic", () => {
        const validation = publicKeySchema.validate(INVALID_MNEMONIC);
        expect(validation.error).toBeDefined();
        expect(validation.error.details[0].type === "crypto.mnemonic.invalid");
    });

});