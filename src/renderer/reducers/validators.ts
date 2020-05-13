import {Action} from "redux";

import {ILoadedValidatorBalanceAction} from "../actions/validator";
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
