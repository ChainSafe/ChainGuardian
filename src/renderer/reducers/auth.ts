import {IStoreAuthAction} from "../actions/auth";
import {AuthActionTypes} from "../constants/action-types";
import {Action} from "redux";
import {CGAccount} from "../models/account";

export interface IAuthState {
    account: CGAccount | null,
}

const initialState: IAuthState = {
    account: null,
};

export const authReducer = (state = initialState, action: Action<AuthActionTypes>): IAuthState => {
    switch (action.type) {
        case AuthActionTypes.STORE_AUTH:
            return Object.assign({}, state, {
                account: (action as IStoreAuthAction).payload.auth
            });
        default:
            return state;
    }
};