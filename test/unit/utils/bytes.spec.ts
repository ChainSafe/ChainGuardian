import {base64Decode, base64Encode, fromHex, toHex} from "../../../src/renderer/services/utils/bytes";

describe("bytes utils", function () {
    it("base64", function () {
        const testData = Buffer.from("chainsafe");
        const result = base64Decode(base64Encode(testData));
        expect(testData).toEqual(result);
    });

    it("hex", function () {
        const testData = Buffer.from("chainsafe");
        const result = fromHex(toHex(testData));
        expect(testData).toEqual(result);
    });
});
