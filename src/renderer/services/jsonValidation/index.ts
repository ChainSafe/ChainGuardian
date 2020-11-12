import Ajv, {Options} from "ajv";
import slashingJson from "./slashing.schema.json";

export const createValidator = (schemas: Options["schemas"], options: Options = {}) => (schema: object): boolean =>
    new Ajv({...options, schemas}).validateSchema(schema);

export const slashingValidator = createValidator(slashingJson);
