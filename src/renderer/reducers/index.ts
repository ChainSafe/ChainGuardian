import {combineReducers} from "redux";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IRootState {

}

export const rootReducer = combineReducers<IRootState | undefined>({
    blank: function(state: IRootState) {return state || {};}
});
