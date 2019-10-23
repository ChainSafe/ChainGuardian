import {SimpleContainerType} from "@chainsafe/ssz";

export const Account = (): SimpleContainerType => ({
    fields: [
        ["name", "bytes512"],
        ["directory", "bytes512"],
        ["sendStats", "bool"],
    ],
});