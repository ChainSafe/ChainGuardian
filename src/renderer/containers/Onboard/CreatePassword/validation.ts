import * as Joi from "@hapi/joi";
import passwordComplexity from "../../../services/validation/password-complexity";

export const passwordFormSchema = Joi.object().keys({
    password: passwordComplexity().required(),
    confirm: Joi.string().valid(Joi.ref("password")).messages({"any.only": "Passwords are not equal"}),
}).with("password", "confirm");