// tslint:disable-next-line: import-name
import {toBufferLE} from "bigint-buffer";

import {encodeKey} from "../../../src/renderer/services/db/schema";

// Mocking Bucket enum with a plain number
const BucketMock = 1;

describe("encodeKey", () => {
    const testCases = [
        {input: {bucket: BucketMock, key: Buffer.from([0, 0, 0, 1])}, type: "Buffer"},
        {input: {bucket: BucketMock, key: Buffer.from([0, 1, 0, 1])}, type: "Buffer"},
        {input: {bucket: BucketMock, key: 5}, type: "number"},
        {input: {bucket: BucketMock, key: BigInt(5)}, type: "bigint"},
        {input: {bucket: BucketMock, key: "test"}, type: "string"}
    ];
    for (const {
        input: {bucket, key},
        type
    } of testCases) {
        it(`should properly encode ${type}`, () => {
            let expected;
            const bucketUInt8 = new Uint8Array([bucket]);
            if (type === "Buffer") {
                expected = Buffer.concat([bucketUInt8, key as Buffer]);
            } else if (typeof key === "string") {
                expected = Buffer.concat([bucketUInt8, Buffer.from(key)]);
            } else if (typeof key === "number") {
                expected = Buffer.concat([bucketUInt8, toBufferLE(BigInt(key), 8)]);
            } else if (typeof key === "bigint") {
                expected = Buffer.concat([bucketUInt8, toBufferLE(key, 8)]);
            }
            // @ts-ignore
            const actual = encodeKey(bucket, key);
            expect(actual).toEqual(expected);
        });
    }
});
