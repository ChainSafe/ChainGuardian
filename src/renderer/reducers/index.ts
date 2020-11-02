import {combineReducers} from "redux";
import {IRegisterState, registerReducer} from "./register";
import {depositReducer, IDepositState} from "./deposit";
import {authReducer, IAuthState} from "./auth";
import {INotificationStateObject, notificationReducer} from "./notification";
import {INetworkState, networkReducer} from "./network";
import {IValidatorState, validatorsReducer} from "./validators";

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
    deposit: depositReducer,
    auth: authReducer,
    notificationArray: notificationReducer,
    network: networkReducer,
    validators: validatorsReducer,
});
