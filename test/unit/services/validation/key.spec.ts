import {CustomHelpers, ErrorReport} from "@hapi/joi";
import {privateKeyLength, publicKeyLength} from "../../../../src/renderer/services/validation/key";

const VALID_PUBLIC_KEY =
    "92fffcc44e690220c190be41378baf6152560eb13fa73bdf8b45120b56096acc4b4e87a0e0b97f83e48f0ff4990daa18";
const VALID_PRIVATE_KEY =
    "d68ffdb8b9729cb02c5be506e9a2fad086746b4bdc2f50fb74d10ac8419c5259";
const INVALID_KEY =
    "8ffdb8b97";

describe("Joi custom key validation functions unit tests.", () => {

    it("should success valid public key", async () => {
        const result = publicKeyLength(
            VALID_PUBLIC_KEY,
            {} as CustomHelpers
        );
        expect(result).toBe(VALID_PUBLIC_KEY);
    });

    it("should fail public key length invalid", async () => {
        publicKeyLength(
            INVALID_KEY,
            {
                error: (code) => {
                    expect(code).toBe("key.invalid");
                    return {} as ErrorReport;
                }
            } as CustomHelpers
        );
    });

    it("should success valid private key", async () => {
        const result = privateKeyLength(
            VALID_PRIVATE_KEY,
            {} as CustomHelpers
        );
        expect(result).toBe(VALID_PRIVATE_KEY);
    });

    it("should fail private key length invalid", async () => {
        privateKeyLength(
            INVALID_KEY,
            {
                error: (code) => {
                    expect(code).toBe("key.invalid");
                    return {} as ErrorReport;
                }
            } as CustomHelpers
        );
    });

});