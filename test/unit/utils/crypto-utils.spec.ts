import {toHexString} from "../../../src/renderer/services/utils/crypto";

describe("crypto utils unit tests", () => {
    it("should successfully prefix string to become hex string.", async () => {
        expect(toHexString("a1b2c3")).toBe("0xa1b2c3");
    });

    it("should successfully convert Buffer to become hex string.", async () => {
        expect(toHexString(Buffer.from([1, 2, 3]))).toBe("0x010203");
    });

    it("should successfully convert Buffer to become hex string.", async () => {
        expect(toHexString(BigInt(3405697037))).toBe("0xcafed00d");
    });
});
