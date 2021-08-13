import {ContainerType, BooleanType} from "@chainsafe/ssz";
import {CGAccount} from "../account";
import {StringType} from "@chainsafe/lodestar-types";

export const AccountType = new ContainerType<CGAccount>({
    fields: {
        name: new StringType(),
        directory: new StringType(),
        sendStats: new BooleanType(),
    },
});
