import Ajv, {Options} from "ajv";
import slashingJson from "./slashing.schema.json";
import {readFileSync} from "fs";

export const createValidator = (schema: object, options: Options = {}) => (data: object | string): boolean =>
    new Ajv(options).compile(schema)(data) as boolean;

// https://github.com/ethereum/EIPs/blob/master/EIPS/eip-3076.md
export const slashingValidator = createValidator(slashingJson);

export const validateSlashingFile = (path: string): boolean =>
    slashingValidator(JSON.parse(readFileSync(path).toString()));
