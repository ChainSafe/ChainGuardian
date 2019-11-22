import {CustomHelpers, ErrorReport} from "@hapi/joi";
import {trimHex} from "../../../../src/renderer/services/validation/trim-hex";

const VALID_HEX =
    "0xd68ffdb8b9729cb02c5be506e9a2fad086746b4bdc2f50fb74d10ac8419c5259";
const INVALID_HEX =
    "8ffdb8b97";

describe("Joi custom trim hex unit tests.", () => {

    it("should success and remove 0x prefix valid hex string", async () => {
        const result = trimHex(
            VALID_HEX,
            {} as CustomHelpers
        );
        expect(result).toBe(VALID_HEX.substr(2));
    });

    it("should fail hex string invalid", async () => {
        trimHex(
            INVALID_HEX,
            {
                error: (code) => {
                    expect(code).toBe("custom.thex");
                    return {} as ErrorReport;
                }
            } as CustomHelpers
        );
    });

});