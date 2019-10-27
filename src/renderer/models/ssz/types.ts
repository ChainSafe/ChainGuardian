import {Type, AnyContainerType} from "@chainsafe/ssz";

export const Account: AnyContainerType = {
    type: Type.container,
    fields: [
        ["name", "bytes512"],
        ["directory", "bytes512"],
        ["sendStats", "bool"],
    ],
};