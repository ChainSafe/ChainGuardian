import {ICGSerialization} from "../";
import {AnySSZType, deserialize, hashTreeRoot, serialize} from "@chainsafe/ssz";

class SSZSerializer implements ICGSerialization<AnySSZType> {
    serialize(value: any, type: AnySSZType): Buffer {
        return serialize(value, type);
    }
    deserialize<R>(value: Buffer, type: AnySSZType): R {
        return deserialize(value, type);
    }
    hashTreeRoot(value: any, type: AnySSZType): Buffer {
        return hashTreeRoot(value, type);
    }
}

export const SSZ = new SSZSerializer();
