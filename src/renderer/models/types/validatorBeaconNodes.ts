import {ContainerType, ListType} from "@chainsafe/ssz";
import {ValidatorBeaconNodes} from "../validatorBeaconNodes";
import {StringType} from "@chainsafe/lodestar-types";

export const ValidatorBeaconNodesType = new ContainerType<ValidatorBeaconNodes>({
    fields: {
        nodes: new ListType({elementType: new StringType(), limit: 1}),
    },
});
