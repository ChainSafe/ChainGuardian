import {ILoadValidators, IStoreAuthAction} from "../actions/auth";
import {AuthActionTypes} from "../constants/action-types";
import {Action} from "redux";
import {IValidator} from "../containers/Dashboard/DashboardContainer";
import {CGAccount} from "../models/account";

export interface IAuthState {
    account: CGAccount | null,
    validators: IValidator[],
}

const initialState: IAuthState = {
    account: null,
    validators: [],
};

export const authReducer = (state = initialState, action: Action<AuthActionTypes>): IAuthState => {
    switch (action.type) {
        case AuthActionTypes.STORE_AUTH:
            return Object.assign({}, state, {
                account: (action as IStoreAuthAction).payload.auth
            });
        case AuthActionTypes.LOAD_VALIDATORS:
            return Object.assign({}, state, {
                validators: (action as ILoadValidators).payload
            });
        default:
            return state;
    }
};
