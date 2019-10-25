import {SimpleContainerType, Type} from "@chainsafe/ssz";

// @ts-ignore
export const Account: SimpleContainerType = {
    // @ts-ignore
    type: Type.container,
    fields: [
        ["name", "bytes512"],
        ["directory", "bytes512"],
        ["sendStats", "bool"],
    ],
};