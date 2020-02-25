import {AnyContainerType} from "@chainsafe/ssz";

export const Account: AnyContainerType = {
    fields: [
        ["name", "bytes512"],
        ["directory", "bytes512"],
        ["sendStats", "bool"],
    ],
};

const BeaconNode: AnyContainerType = {
    fields: [
        ["url", "string"],
        ["isLocalNetwork", "bool"],
    ],
};

export const ValidatorBeaconNode: AnyContainerType = {
    fields: [
        ["nodes", {
            elementType: BeaconNode,
            maxLength: 4, // TODO: move constant
        }],
    ],
};
