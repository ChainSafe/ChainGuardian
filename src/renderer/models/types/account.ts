import {ContainerType} from "@chainsafe/ssz";
import {StringType} from "./basic";
import {config} from "@chainsafe/lodestar-config/lib/presets/mainnet";

export const AccountType = new ContainerType<Account>({
    fields: {
        "name": new StringType(),
        "directory": new StringType(),
        "sendStats": config.types.Boolean
    }
});