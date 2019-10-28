import {AnyContainerType} from "@chainsafe/ssz";

export const Account: AnyContainerType = {
    fields: [
        ["name", "bytes512"],
        ["directory", "bytes512"],
        ["sendStats", "bool"],
    ],
};