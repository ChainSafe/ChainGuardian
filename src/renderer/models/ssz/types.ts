import {AnyContainerType} from "@chainsafe/ssz";

export const Account: AnyContainerType = {
    fields: [
        ["name", "bytes512"],
        ["directory", "bytes512"],
        ["sendStats", "bool"],
    ],
};

export const BeaconNode: AnyContainerType = {
    fields: [
        ["url", "bytes512"],
        ["validatorAddress", "bytes512"],
    ],
};
