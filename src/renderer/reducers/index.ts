import {combineReducers} from "redux";
import {ICounterState, counterReducer} from "./counterReducer";

export interface IRootState {
    counter: ICounterState;
}

export const rootReducer = combineReducers<IRootState | undefined>({
    counter: counterReducer
});
