import {ContainerType, BooleanType} from "@chainsafe/ssz";
import {StringType} from "./basic";
import {CGAccount} from "../account";

export const AccountType = new ContainerType<CGAccount>({
    fields: {
        name: new StringType(),
        directory: new StringType(),
        sendStats: new BooleanType(),
    },
});
