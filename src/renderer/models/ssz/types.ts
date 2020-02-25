import {AnyContainerType} from "@chainsafe/ssz";
import {MAX_VALIDATOR_BEACON_NODES} from "../../constants/account";

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
            maxLength: MAX_VALIDATOR_BEACON_NODES,
        }],
    ],
};
