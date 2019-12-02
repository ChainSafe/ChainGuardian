import {ObjectSchema} from "@hapi/joi";
import {Joi} from "../../../services/validation";

export const passwordFormSchema = Joi.object().keys({
    password: Joi.password()
        .min(6)
        .max(12)
        .numOfLower(1)
        .numOfUpper(1)
        .numOfNumbers(1)
        .numOfSigns(1)
        .required()
        .messages({

        }),
    confirm: Joi.string()
        .valid(Joi.ref("password"))
        .messages({
            "any.only": "Passwords are not equal"
        }),
}).with("password", "confirm") as ObjectSchema;