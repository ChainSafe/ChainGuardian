import {combineReducers} from "redux";
import {IRegisterState, registerReducer} from "./register";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IRootState {
    register: IRegisterState
}

export const rootReducer = combineReducers<IRootState >({
    register: registerReducer
});
