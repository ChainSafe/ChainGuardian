import {Joi} from "../../../../src/renderer/services/validation";

const passwordSchema =
    Joi.password().min(6).max(12).numOfLower(1).numOfUpper(1).numOfNumbers(1).numOfSigns(1);

describe("Joi custom crypto validation functions unit tests.", () => {

    it("should reject a password that is too short", () => {
        const validation = passwordSchema.validate("123");
        expect(validation.error).toBeDefined();
        expect(validation.error.details[0].type === "string.min");
    });

    it("should reject a password that is too long", () => {
        const validation = passwordSchema.validate("123456791234567912345679123");
        expect(validation.error).toBeDefined();
        expect(validation.error.details[0].type === "string.max");
    });

    it("should reject a password that doesn't meet the required lowercase count", () => {
        const validation = passwordSchema.validate("ABCDEFG");
        expect(validation.error).toBeDefined();
        expect(validation.error.details[0].type === "password.lower");
    });

    it("should reject a password that doesn't meet the required uppercase count", () => {
        const validation = passwordSchema.validate("abcdefg");
        expect(validation.error).toBeDefined();
        expect(validation.error.details[0].type === "password.upper");
    });

    it("should reject a password that doesn't meet the required numeric count", () => {
        const validation = passwordSchema.validate("abCDefg");
        expect(validation.error).toBeDefined();
        expect(validation.error.details[0].type === "password.numbers");
    });

    it("should reject a password that doesn't meet the required symbol count", () => {
        const validation = passwordSchema.validate("abCDefg123");
        expect(validation.error).toBeDefined();
        expect(validation.error.details[0].type === "password.signs");
    });

    it("should accept a valid password", () => {
        const validation = passwordSchema.validate("abCD12#$");
        expect(validation.error).toBeUndefined();
    });

    it("should reject a password that doesn't meet multiple requirements", () => {
        const validation = passwordSchema.validate("abc", {abortEarly: false});
        expect(validation.error).toBeDefined();
        expect(validation.error.details.length).toBe(4);
        expect(validation.error.details[0].type === "string.min");
        expect(validation.error.details[1].type === "password.upper");
        expect(validation.error.details[2].type === "password.numbers");
        expect(validation.error.details[3].type === "password.signs");
    });

    it("should reject a password that is empty string", () => {
        const validation = passwordSchema.validate("");
        expect(validation.error).toBeDefined();
        expect(validation.error.details[0].type === "string.empty");
    });

});