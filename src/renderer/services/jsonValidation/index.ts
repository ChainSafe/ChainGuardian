import Ajv, {Options} from "ajv";
import slashingJson from "./slashing.schema.json";
import {readFileSync} from "fs";

export const createJSONValidator = (schema: object, options: Options = {}) => (data: object | string): boolean =>
    new Ajv(options).compile(schema)(data) as boolean;

// https://github.com/ethereum/EIPs/blob/master/EIPS/eip-3076.md
export const slashingJSONValidator = createJSONValidator(slashingJson);

export const validateSlashingFile = (path: string): boolean =>
    slashingJSONValidator(JSON.parse(readFileSync(path).toString()));
