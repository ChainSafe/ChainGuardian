export interface ICGSerialization<T> {
    serialize(value: any, type: T): Buffer;
    deserialize<R>(value: Buffer, type: T): R;
    hashTreeRoot(value: any, type: T): Buffer;
}
