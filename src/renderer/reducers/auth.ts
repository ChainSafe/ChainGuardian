import {IStoreAuthAction,IStorePasswordAction} from "../actions/auth";
import {AuthActionTypes} from "../constants/action-types";
import {Action} from "redux";
import {CGAccount} from "../models/account";

export interface IAuthState {
    auth: CGAccount | null,
    password: string
}

const initialState: IAuthState = {
    auth: null,
    password: ""
};

export const authReducer = (state = initialState, action: Action<AuthActionTypes>): IAuthState => {
    switch (action.type) {
        case AuthActionTypes.STORE_AUTH:
            return Object.assign({}, state, {
                auth: (action as IStoreAuthAction).payload.auth
            });
        case AuthActionTypes.STORE_PASSWORD:
            return Object.assign({}, state, {
                password: (action as IStorePasswordAction).payload.password
            });
        default:
            return state;
    }
};