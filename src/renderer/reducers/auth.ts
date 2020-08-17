import {AuthAction, AuthActionTypes} from "../actions";
import {CGAccount} from "../models/account";

export interface IAuthState {
    account: CGAccount | null,
}

const initialState: IAuthState = {
    account: null,
};

export const authReducer = (state = initialState, action: AuthAction): IAuthState => {
    switch (action.type) {
        case AuthActionTypes.STORE_AUTH:
            return Object.assign({}, state, {
                account: action.payload.auth
            });
        default:
            return state;
    }
};
