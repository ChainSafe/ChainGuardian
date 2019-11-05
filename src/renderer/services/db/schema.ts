/**
 * @module db/schema
 */

// tslint:disable-next-line: import-name
import BN from "bn.js";

// Buckets are separate database namespaces
export enum Bucket {
    account,
    httpMetrics,
    beaconMetrics,
    generalMetrics
}

export enum Key {}

/**
 * Prepend a bucket to a key
 */
export function encodeKey(bucket: Bucket, key: Buffer | string | number | BN, useBuffer = true): Buffer | string {
    let buf;
    if (typeof key === "string") {
        buf = Buffer.alloc(key.length + 1);
        buf.write(key, 1);
    } else if (typeof key === "number" || BN.isBN(key)) {
        buf = Buffer.alloc(9);
        new BN(key).toArrayLike(Buffer, "le", 8).copy(buf, 1);
    } else {
        buf = Buffer.alloc(key.length + 1);
        key.copy(buf, 1);
    }
    buf.writeUInt8(bucket, 0);
    return useBuffer ? buf : buf.toString("hex");
}
