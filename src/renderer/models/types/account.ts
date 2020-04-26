import {ContainerType} from "@chainsafe/ssz";
import {StringType} from "./basic";
import {config} from "@chainsafe/lodestar-config/lib/presets/mainnet";
import {CGAccount} from "../account";

export const AccountType = new ContainerType<CGAccount>({
    fields: {
        "name": new StringType(),
        "directory": new StringType(),
        "sendStats": config.types.Boolean
    }
});