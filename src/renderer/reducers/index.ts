import {combineReducers} from "redux";
import {IRegisterState, registerReducer} from "./register";
import {IDepositState, depositReducer} from "./deposit";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IRootState {
    register: IRegisterState,
    deposit: IDepositState
}

export const rootReducer = combineReducers<IRootState>({
    register: registerReducer,
    deposit: depositReducer
});
