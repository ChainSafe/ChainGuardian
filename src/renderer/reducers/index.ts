import {combineReducers} from "redux";
import {ADD_MNEMONIC} from "../constants/action-types";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IRootState {
    
}

const initalState = {
    mnemonic: []
};

export const rootReducer = combineReducers<IRootState >({
    blank: function(state: IRootState) {return state || {};},

    mnemonicReducer: function(state = initalState, action: any) {
        if (action.type === ADD_MNEMONIC) {
            return Object.assign({}, state, {
                mnemonic: initalState.mnemonic.concat(action.payload)
            });
        }
        return state;
    }
});
