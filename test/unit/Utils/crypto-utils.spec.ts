import { toHexString, EthConverter } from '../../../src/renderer/services/utils/crypto-utils';
import BN = require('bn.js');

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

    it('should convert successfully eth to gwei', function() {
        expect(EthConverter.toGwei(1).toString(10)).toBe("1000000000");
    });

    it('should convert successfully eth to wei', function() {
        expect(EthConverter.toWei(1).toString(10)).toBe("1000000000000000000");
    });
});
