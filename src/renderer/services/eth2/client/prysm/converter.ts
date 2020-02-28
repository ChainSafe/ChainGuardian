import {AnyContainerType, FullSSZType, Type} from "@chainsafe/ssz-type-schema/lib/types";
import {parseType} from "@chainsafe/ssz";
import {BitList, BitVector} from "@chainsafe/bit-utils";
import {base64Decode, base64Encode} from "../../../utils/bytes";

export function toPrysmaticJson(value: unknown): unknown {
    if (Buffer.isBuffer(value)) {
        return base64Encode(value);
    }
    if (typeof value === "bigint") {
        return value.toString();
    }
    if (BitVector.isBitVector(value)) {
        return base64Encode(Buffer.from((value as BitVector).toBitfield().buffer));
    }
    if (BitList.isBitList(value)) {
        return base64Encode(Buffer.from((value as BitList).serialize().buffer));
    }
    if (Array.isArray(value)) {
        return value.map(toPrysmaticJson);
    }
    if (typeof value === "object") {
        return toPrysmaticJson(value);
    }
    return value;
}

export function fromPrysmaticJson<T>(type: AnyContainerType<T>, data: object): T {
    return fromJson(parseType(type), data) as T;
}


function fromJson(type: FullSSZType, value: any): unknown {
    switch (type.type) {
        case Type.uint:
            if (type.byteLength <= 6 || type.use === "number") {
                const n = Number(value);
                return Number.isSafeInteger(n) ? n : Infinity;
            } else {
                return BigInt(value);
            }
        case Type.bool:
            return value;
        case Type.bitList:
            return BitList.deserialize(base64Decode(value));
        case Type.bitVector:
            return BitVector.fromBitfield(base64Decode(value), type.length);
        case Type.byteList:
        case Type.byteVector:
            return base64Decode(value);
        case Type.list:
        case Type.vector:
            return value.map((element: unknown) => fromJson(type.elementType, element));
        case Type.container:
            type.fields.forEach(([fieldName, fieldType]) => {
                value[fieldName] = fromJson(parseType(fieldType), value[fieldName]);
            });
            return value;
    }
}
