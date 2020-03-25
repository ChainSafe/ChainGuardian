import {BasicType} from "@chainsafe/ssz";

export class StringType extends BasicType<string> {

    public serialize(value: string): Uint8Array {
        return Buffer.from(value, "utf-8");
    }

    public deserialize(data: Uint8Array): string {
        return Buffer.from(data).toString("utf-8");
    }
}