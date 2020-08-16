import {Validator} from "@chainsafe/lodestar-validator/lib";
import {Action, Dispatch, Middleware} from "redux";
import {ValidatorAction, ValidatorActionTypes} from "../../actions/validator";

interface IValidatorServices {
    [validatorAddress: string]: Validator;
}

export const createValidatorMiddleware = (): Middleware => {
    const validatorServices: IValidatorServices = {};

    return () => (next: Dispatch) => async (action: ValidatorAction): Promise<Action> => {
        let publicKey: string;

        switch (action.type) {
            case ValidatorActionTypes.START_VALIDATOR_SERVICE:
                publicKey = action.payload.keypairs[0].publicKey.toHexString();
                if (!validatorServices[publicKey]) {
                    validatorServices[publicKey] = new Validator(action.payload);
                }
                await validatorServices[publicKey].start();
                break;

            case ValidatorActionTypes.STOP_VALIDATOR_SERVICE:
                await validatorServices[action.payload].stop();
                break;
        }
        return next(action);
    };
};

