import {ICGSerialization} from "../";
import {Type} from "@chainsafe/ssz";

class JSONSZ implements ICGSerialization<Type<any>> {
    public serialize(value: unknown, type: Type<unknown>): Buffer {
        return Buffer.from(JSON.stringify(type.toJson(value)), "utf-8");
    }

    public deserialize<R>(value: Buffer | Uint8Array, type: Type<R>): R {
        return type.fromJson(JSON.parse(Buffer.from(value).toString("utf-8")));
    }
    public hashTreeRoot(value: unknown, type: Type<unknown>): Buffer {
        return Buffer.from(type.hashTreeRoot(value));
    }
}

export const JSONSerializer = new JSONSZ();
