import {upperRule} from "./upper";
import {lowerRule} from "./lower";
import {numberRule} from "./numbers";
import {signsRule} from "./signs";
import * as Joi from "@hapi/joi";
import {Extension} from "@hapi/joi";

export const passwordExtension = (joi: Joi.Root): Extension => ({
    base: joi.string(),
    type: "password",
    rules: {
        ...upperRule,
        ...lowerRule,
        ...numberRule,
        ...signsRule,
    },
});
