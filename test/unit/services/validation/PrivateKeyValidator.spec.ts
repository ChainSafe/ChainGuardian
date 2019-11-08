import {privateKeyValidator} from "../../../../src/renderer/services/validators/PrivateKeyValidator";

describe("Joi custom private key schema unit tests.", () => {
    it("should validate valid private key", async () => {
        const result = privateKeyValidator
            .validate("0xd68ffdb8b9729cb02c5be506e9a2fad086746b4bdc2f50fb74d10ac8419c5259");
        expect(result.error).toBeUndefined();
    });

    it("should fail because key length", async () => {
        const result = privateKeyValidator
            .validate("0x8ffdb8b97");
        expect(result.error).toBeDefined();
    });
});
