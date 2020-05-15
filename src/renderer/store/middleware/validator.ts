import {Validator} from "@chainsafe/lodestar-validator/lib";
import {Action, Dispatch, Middleware, MiddlewareAPI} from "redux";
import {IStartValidatorServiceAction} from "../../actions";
import {ValidatorActionTypes} from "../../constants/action-types";

export const createValidatorMiddleware = (): Middleware => {
    let validatorService: Validator;

    return (getState: MiddlewareAPI) => (next: Dispatch) => (action: Action<ValidatorActionTypes>) => {
        switch (action.type) {
            case ValidatorActionTypes.START_VALIDATOR_SERVICE:
                if (!validatorService) {
                    validatorService = new Validator((action as IStartValidatorServiceAction).payload);
                }
                validatorService.start();
                break;
            case ValidatorActionTypes.STOP_VALIDATOR_SERVICE:
                validatorService.stop();
                break;
        }
        return next(action);
    }
};

