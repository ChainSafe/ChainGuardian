import {ObjectSchema} from "joi";
import {Joi} from "../../../services/validation";

export const passwordFormSchema = Joi.object()
    .keys({
        password: Joi.password()
            .required()
            .min(6)
            .max(12)
            .numOfLower(1)
            .numOfUpper(1)
            .numOfNumbers(1)
            .numOfSigns(1)
            .messages({
                "string.empty": "Password must be at least 6 characters long",
                "string.min": "Password must be at least 6 characters long",
                "string.max": "Password must be at most 12 characters long",
                "complexity.upper":
                    "Password must contain: 1 uppercase, 1 lowercase, 1 numeric and 1 special character",
                "complexity.lower":
                    "Password must contain: 1 uppercase, 1 lowercase, 1 numeric and 1 special character",
                "complexity.numbers":
                    "Password must contain: 1 uppercase, 1 lowercase, 1 numeric and 1 special character",
                "complexity.signs":
                    "Password must contain: 1 uppercase, 1 lowercase, 1 numeric and 1 special character",
            }),
        confirm: Joi.string().valid(Joi.ref("password")).messages({
            "any.only": "That password doesn't match. Try again?",
        }),
        errorMessages: Joi.any(),
    })
    .with("password", "confirm") as ObjectSchema;
