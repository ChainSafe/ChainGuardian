import { CGSerialization } from '../';
import { AnySSZType, deserialize, hashTreeRoot, serialize } from '@chainsafe/ssz';

class SSZSerializer implements CGSerialization<AnySSZType> {
    serialize(value: any, type: AnySSZType): Buffer {
        return serialize(value, type);
    }
    deserialize(value: Buffer, type: AnySSZType): any {
        return deserialize(value, type);
    }
    hashTreeRoot(value: any, type: AnySSZType): Buffer {
        return hashTreeRoot(value, type);
    }
}

const SSZ = new SSZSerializer();

export default SSZ;
