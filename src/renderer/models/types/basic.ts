import {BasicType} from "@chainsafe/ssz";

export class StringType extends BasicType<string> {
    public toJson(value: string): string {
        return value;
    }

    public fromJson(data: string): string {
        return data;
    }
}
