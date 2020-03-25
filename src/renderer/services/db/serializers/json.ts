import {ICGSerialization} from "../";
import {Type} from "@chainsafe/ssz";

class JSONSZ implements ICGSerialization<Type<unknown>> {
    public serialize(value: unknown, type: Type<unknown>): Buffer {
        return Buffer.from(JSON.stringify(type.toJson(value)));
    }
    // eslint-disable-next-line
    public deserialize<R>(value: Buffer, type?: Type<unknown>): R {
        return JSON.parse(value.toString("utf-8"));
    }
    public hashTreeRoot(value: unknown, type: Type<unknown>): Buffer {
        return Buffer.from(type.hashTreeRoot(value));
    }
}

export const JSONSerializer = new JSONSZ();
