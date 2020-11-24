import {ContainerType, ListType} from "@chainsafe/ssz";
import {StringType} from "./basic";
import {ValidatorBeaconNodes} from "../validatorBeaconNodes";

export const ValidatorBeaconNodesType = new ContainerType<ValidatorBeaconNodes>({
    fields: {
        nodes: new ListType({elementType: new StringType(), limit: 1}),
    },
});
