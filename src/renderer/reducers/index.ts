import {combineReducers} from "redux";
import {IRegisterState, registerReducer} from "./register";
import {IDepositState, depositReducer} from "./deposit";
import {IAuthState, authReducer} from "./auth";
import {INotificationStateObject, notificationReducer} from "./notification";
import {INetworkState, networkReducer} from "./network";

export interface IRootState {
    register: IRegisterState,
    deposit: IDepositState,
    auth: IAuthState,
    notificationArray: INotificationStateObject,
    network: INetworkState,
}

export const rootReducer = combineReducers<IRootState>({
    register: registerReducer,
    deposit: depositReducer,
    auth: authReducer,
    notificationArray: notificationReducer,
    network: networkReducer,
});
