import {combineReducers} from "redux";
import {IRegisterState, registerReducer} from "./register";
import {IDepositState, depositReducer} from "./deposit";
import {IAuthState, authReducer} from "./auth";
import {INotificationState, notificationReducer} from "./notification";

export interface IRootState {
    register: IRegisterState,
    deposit: IDepositState,
    auth: IAuthState,
    notificationArray: INotificationState
}

export const rootReducer = combineReducers<IRootState>({
    register: registerReducer,
    deposit: depositReducer,
    auth: authReducer,
    notificationArray: notificationReducer
});
