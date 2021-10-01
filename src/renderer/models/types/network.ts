import {ContainerType} from "@chainsafe/ssz";
import {ValidatorNetwork} from "../network";
import {StringType} from "@chainsafe/lodestar-types";

export const NetworkType = new ContainerType<ValidatorNetwork>({
    fields: {
        name: new StringType(),
    },
});
