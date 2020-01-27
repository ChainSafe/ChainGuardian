import {combineReducers} from "redux";
import {IRegisterState, registerReducer} from "./register";
import {IDepositState, depositReducer} from "./deposit";
import {IAuthState, authReducer} from "./auth";
import {IAddValidatorState,addValidatorReducer} from "./addValidator";
import {IBeforeQuitState, beforeQuitReducer} from "./beforeQuit"

export interface IRootState {
    register: IRegisterState,
    deposit: IDepositState,
    auth: IAuthState,
    addValidator: IAddValidatorState,
    beforeQuit: IBeforeQuitState
}

export const rootReducer = combineReducers<IRootState>({
    register: registerReducer,
    deposit: depositReducer,
    auth: authReducer,
    addValidator: addValidatorReducer,
    beforeQuit: beforeQuitReducer
});
