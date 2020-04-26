export interface ICGSerialization<T> {
    serialize(value: unknown, type: T): Buffer;
    deserialize<R>(value: Buffer, type: T): R;
    hashTreeRoot(value: unknown, type: T): Buffer;
}
