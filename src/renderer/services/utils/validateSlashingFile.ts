import {parseInterchange} from "@chainsafe/lodestar-validator/lib/slashingProtection/interchange";
import {readFileSync} from "fs";
import {Root} from "@chainsafe/lodestar-types/lib/types/primitive";
import {IBeaconConfig} from "@chainsafe/lodestar-config";

export const validateSlashingFile = (path: string, config: IBeaconConfig, genesisValidatorsRoot: Root): boolean => {
    try {
        const interchange = JSON.parse(readFileSync(path).toString());
        parseInterchange(config, interchange, genesisValidatorsRoot);
        return true;
    } catch {
        return false;
    }
};
