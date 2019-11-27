import * as Joi from "@hapi/joi";
import passwordComplexity from "../../../services/validation/password-complexity";

export const passwordFormSchema = Joi.object({
    password: passwordComplexity().required(),
    confirm: Joi.string().valid(Joi.ref("password")),
});