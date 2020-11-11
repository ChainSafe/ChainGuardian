import {ContainerType} from "@chainsafe/ssz";
import {StringType} from "./basic";
import {ValidatorNetwork} from "../network";

export const NetworkType = new ContainerType<ValidatorNetwork>({
    fields: {
        name: new StringType(),
    },
});
