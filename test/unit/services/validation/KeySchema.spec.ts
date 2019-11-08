import {keySchema} from "../../../../src/renderer/services/validators/KeySchema";


describe("Joi custom key schema unit tests.", () => {
    it("should validate valid key", async () => {
        const result = keySchema
            .validate("0xd68ffdb8b9729cb02c5be506e9a2fad086746b4bdc2f50fb74d10ac8419c5259");
        expect(result.error).toBeUndefined();
    });

    it("should fail because key is not string", async () => {
        const result = keySchema
            .validate(12345678);
        expect(result.error).toBeDefined();
    });

    it("should fail because key is not hex", async () => {
        const result = keySchema
            .validate("d68ffdb8b9729cb02c5be506e9a2fad086746b4bdc2f50fb74d10ac8419c5259");
        expect(result.error).toBeDefined();
    });
});
