import {upperRule} from "./upper";
import {lowerRule} from "./lower";
import {numberRule} from "./numbers";
import {signsRule} from "./signs";
import * as Joi from "joi";

export const passwordExtension = (joi: Joi.Root): Joi.Extension => ({
    base: joi.string(),
    type: "password",
    rules: {
        ...upperRule,
        ...lowerRule,
        ...numberRule,
        ...signsRule,
    },
});
