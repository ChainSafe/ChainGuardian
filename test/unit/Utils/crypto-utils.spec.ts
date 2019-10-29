import {toHexString, EthConverter} from "../../../src/renderer/services/utils/crypto-utils";
import BN from "bn.js";

describe("crypto utils unit tests", () => {
    it("should successfully prefix string to become hex string.", async () => {
        expect(toHexString("a1b2c3")).toBe("0xa1b2c3");
    });

    it("should successfully convert Buffer to become hex string.", async () => {
        expect(toHexString(Buffer.from([1, 2, 3]))).toBe("0x010203");
    });

    it("should successfully convert Buffer to become hex string.", async () => {
        expect(toHexString(new BN(	3405697037))).toBe("0xcafed00d");
    });

    it("should convert successfully eth to gwei", function() {
        expect(EthConverter.convertEth("1", "gwei").toString(10))
            .toBe("1000000000");
    });

    it("should convert successfully eth to wei", function() {
        expect(EthConverter.convertEth("1", "wei").toString(10))
            .toBe("1000000000000000000");
    });

    it("should convert successfully wei to eth", function() {
        expect(EthConverter.convertWei("1000000000000000000", "eth").toString(10))
            .toBe("1");
    });

    it("should convert successfully gwei to wei", function() {
        expect(EthConverter.convert("1000000000", "gwei", "wei").toString(10))
            .toBe("1000000000000000000");
    });
});
