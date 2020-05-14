import {Action} from "redux";
import {ILoadValidators} from "../actions";

import {ILoadedValidatorBalanceAction} from "../actions";
import {ValidatorActionTypes} from "../constants/action-types";
import {IValidator} from "../containers/Dashboard/DashboardContainer";

export interface IValidatorState {
    [validatorAddress: string]: IValidator,
}

const initialState: IValidatorState = {
};

export const validatorsReducer = (
    state = initialState,
    action: Action<ValidatorActionTypes>
): IValidatorState => {
    let payload: any;
    switch (action.type) {
        case ValidatorActionTypes.LOAD_VALIDATORS:
            // eslint-disable-next-line no-case-declarations
            const validatorMap: IValidatorState = {};
            (action as ILoadValidators).payload.forEach((v: IValidator) => {
                validatorMap[v.publicKey] = v;
            });

            return validatorMap;
        case ValidatorActionTypes.LOADED_VALIDATOR_BALANCE:
            payload = (action as ILoadedValidatorBalanceAction).payload;
            return {
                ...state,
                [payload.validator]: {...state[payload.validator], balance: payload.balance},
            };
        default:
            return state;
    }
};
