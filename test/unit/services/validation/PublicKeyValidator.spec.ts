import {publicKeyValidator} from "../../../../src/renderer/services/validators/PublicKeyValidator";

describe("Joi custom public key schema unit tests.", () => {
    it("should validate valid public key", async () => {
        const result = publicKeyValidator
        // eslint-disable-next-line max-len
            .validate("0x92fffcc44e690220c190be41378baf6152560eb13fa73bdf8b45120b56096acc4b4e87a0e0b97f83e48f0ff4990daa18");
        expect(result.error).toBeUndefined();
    });

    it("should fail because key length", async () => {
        const result = publicKeyValidator
            .validate("0x8ffdb8b97");
        expect(result.error).toBeDefined();
    });
});