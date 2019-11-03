import {AnyContainerType} from "@chainsafe/ssz";

export const Account: AnyContainerType = {
    fields: [
        ["name", "bytes512"],
        ["directory", "bytes512"],
        ["sendStats", "bool"],
    ],
};


export const Metrics: AnyContainerType = {
    fields: [
        ["date", "bytes256"],
        ["method", "bytes512"],
        ["metric", "uint256"]
    ]
};