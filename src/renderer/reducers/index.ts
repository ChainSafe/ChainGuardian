import {combineReducers} from "redux";
import {IRegisterState, registerReducer} from "./register";
import {IDepositState} from "./deposit";
import {IAuthState} from "./auth";
import {INotificationStateObject, notificationReducer} from "./notification";
import {INetworkState, networkReducer} from "./network";
import {IValidatorState, validatorsReducer} from "./validators";
import {authSlice} from "../ducks/auth/slice";
import {depositSlice} from "../ducks/deposit/slice";

export interface IRootState {
    register: IRegisterState,
    deposit: IDepositState,
    auth: IAuthState,
    notificationArray: INotificationStateObject,
    network: INetworkState,
    validators: IValidatorState,
}

export const rootReducer = combineReducers<IRootState>({
    register: registerReducer,
    deposit: depositSlice.reducer,
    auth: authSlice.reducer,
    notificationArray: notificationReducer,
    network: networkReducer,
    validators: validatorsReducer,
});
