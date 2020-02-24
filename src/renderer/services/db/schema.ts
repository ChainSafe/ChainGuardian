/**
 * @module db/schema
 */

// Buckets are separate database namespaces
import {toBufferLE} from "bigint-buffer";

export enum Bucket {
    account,
    beaconNode,
}

export enum Key {}

/**
 * Prepend a bucket to a key
 */
export function encodeKey(bucket: Bucket, key: Buffer | string | number | bigint, useBuffer = true): Buffer | string {
    let buf;
    if (typeof key === "string") {
        buf = Buffer.alloc(key.length + 1);
        buf.write(key, 1);
    } else if (typeof key === "bigint") {
        buf = Buffer.alloc(9);
        toBufferLE(key, 8).copy(buf, 1);
    } else if (typeof key === "number") {
        buf = Buffer.alloc(9);
        toBufferLE(BigInt(key), 8).copy(buf, 1);
    }  else {
        buf = Buffer.alloc(key.length + 1);
        key.copy(buf, 1);
    }
    buf.writeUInt8(bucket, 0);
    return useBuffer ? buf : buf.toString("hex");
}
