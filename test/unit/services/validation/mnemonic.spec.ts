import {isValidMnemonic} from "../../../../src/renderer/services/validation/mnemonic";
import {CustomHelpers, ErrorReport} from "@hapi/joi";

const VALID_MNEMONIC =
    "hard caught annual spread green step avocado shine scare warm chronic pond";
const INVALID_MNEMONIC =
    "fake attempt red";

describe("Joi custom mnemonic validation function unit tests.", () => {

    it("should success valid mnemonic", async () => {
        const result = isValidMnemonic(
            VALID_MNEMONIC,
            {} as CustomHelpers
        );
        expect(result).toBe(VALID_MNEMONIC);
    });


    it("should fail because mnemonic invalid", async () => {
        isValidMnemonic(
            INVALID_MNEMONIC,
            {
                error: (code) => {
                    expect(code).toBe("mnemonic.invalid");
                    return {} as ErrorReport;
                }
            } as CustomHelpers
        );
    });

});