import {Validator} from "@chainsafe/lodestar-validator/lib";
import {Action, Dispatch, Middleware} from "redux";
import {IStartValidatorServiceAction, IStopValidatorServiceAction} from "../../actions";
import {ValidatorActionTypes} from "../../constants/action-types";

interface IValidatorServices {
    [validatorAddress: string]: Validator;
}

export const createValidatorMiddleware = (): Middleware => {
    const validatorServices: IValidatorServices = {};

    return () => (next: Dispatch) => async (action: Action<ValidatorActionTypes>): Promise<Middleware> => {
        let payload: any;
        let publicKey: string;

        switch (action.type) {
            case ValidatorActionTypes.START_VALIDATOR_SERVICE:
                payload = (action as IStartValidatorServiceAction).payload;
                publicKey = payload.keypair.publicKey.toHexString();
                if (!validatorServices[publicKey]) {
                    validatorServices[publicKey] = new Validator(payload);
                }
                await validatorServices[publicKey].start();
                break;

            case ValidatorActionTypes.STOP_VALIDATOR_SERVICE:
                payload = (action as IStopValidatorServiceAction).payload;
                await validatorServices[payload].stop();
                break;
        }
        return next(action);
    };
};

