import {ValidationError} from "@hapi/joi";

export interface IValidationErrors {
    [k: string]: string[];
}

export function joiValidationToErrorMessages(joiError: ValidationError): IValidationErrors {
    const errors: {[k: string]: string[]} = {};
    if (joiError) {
        joiError.details.forEach(function(detail) {
            detail.path.forEach((path) => {
                if(errors[path]) {
                    errors[path].push(detail.message);
                } else {
                    errors[path] = [detail.message];
                }
            });
        });
    }
    return errors;
}

export interface IValidationErrorsDetails {
    [k: string]: {[t: string]: string[]};
}

export function joiValidationToErrorDetailsMessages(joiError: ValidationError): IValidationErrorsDetails {
    const errors: {[k: string]: {[t: string]: string[]}} = {};
    if (joiError) {
        joiError.details.forEach(function(detail) {
            const baseType = detail.type.split(".")[0];
            detail.path.forEach((path) => {
                if (!errors[path]) errors[path] = {};
                if(!(errors[path])[baseType]) {
                    (errors[path])[baseType] = [detail.message];
                } else {
                    (errors[path])[baseType].push(detail.message);
                }
            });
        });
    }
    return errors;
}
