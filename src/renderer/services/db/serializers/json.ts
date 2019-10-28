import {ICGSerialization} from "../";
import {AnySSZType, hashTreeRoot, Type} from "@chainsafe/ssz";

// Pick subset of keys from key values
function pick(obj: Record<string, any>, keys: string[]): string[] {
    // @ts-ignore
    return keys.map(k => k in obj ? {[k]: obj[k]} : {})
        .reduce((res, o) => Object.assign(res, o), {});
}

class JSONSZ implements ICGSerialization<AnySSZType> {
    public serialize(value: any, type: AnySSZType): Buffer {
        let processedValue = value;
        // @ts-ignore
        if(type.fields !== undefined) {
            // Extract static values from object
            const parsedTypes: string[] = [];
            // @ts-ignore
            type.fields.forEach(element => {
                parsedTypes.push(element[0]);
            });
          
            processedValue = pick(value, parsedTypes);
        }
        return Buffer.from(JSON.stringify(processedValue), "utf-8");
    }
    // eslint-disable-next-line
    public deserialize<R>(value: Buffer, type?: AnySSZType): R {
        return JSON.parse(value.toString("utf-8"));
    }
    public hashTreeRoot(value: any, type: AnySSZType): Buffer {
        return hashTreeRoot(value, type);
    }
}

export const JSONSerializer = new JSONSZ();
