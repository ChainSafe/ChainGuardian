import {ICGSerialization} from "../";
import {Type} from "@chainsafe/ssz";

class SSZSerializer implements ICGSerialization<Type<unknown>> {
    public serialize(value: unknown, type: Type<unknown>): Buffer {
        return Buffer.from(type.serialize(value));
    }
    public deserialize<R>(value: Buffer, type: Type<unknown>): R {
        return type.deserialize(value) as R;
    }
    public hashTreeRoot(value: unknown, type: Type<unknown>): Buffer {
        return Buffer.from(type.hashTreeRoot(value));
    }
}

export const SSZ = new SSZSerializer();
