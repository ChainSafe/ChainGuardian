import {parseInterchange} from "@chainsafe/lodestar-validator/lib/slashingProtection/interchange";
import {readFileSync} from "fs";
import {Root} from "@chainsafe/lodestar-types";

export const validateSlashingFile = (path: string, genesisValidatorsRoot: Root): boolean => {
    try {
        const interchange = JSON.parse(readFileSync(path).toString());
        parseInterchange(interchange, genesisValidatorsRoot);
        return true;
    } catch {
        return false;
    }
};
