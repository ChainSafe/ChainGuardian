import {ICGSerialization} from "../";
import {AnySSZType, deserialize, hashTreeRoot, serialize} from "@chainsafe/ssz";

class SSZSerializer implements ICGSerialization<AnySSZType> {
    public serialize(value: any, type: AnySSZType): Buffer {
        return serialize(type, value);
    }
    public deserialize<R>(value: Buffer, type: AnySSZType): R {
        return deserialize(type, value);
    }
    public hashTreeRoot(value: any, type: AnySSZType): Buffer {
        return hashTreeRoot(type, value);
    }
}

export const SSZ = new SSZSerializer();
