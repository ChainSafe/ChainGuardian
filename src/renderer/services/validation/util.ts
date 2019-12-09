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
