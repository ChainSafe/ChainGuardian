import {combineReducers} from "redux";
import {ADD_MNEMONIC} from "../constants/action-types";
import {IRegisterState} from "./register";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IRootState {
    // register: IRegisterState
}

const initalState = {
    mnemonic: []
};

export const rootReducer = combineReducers<IRootState >({
    blank: function(state: IRootState) {return state || {};},

    mnemonicReducer: function(state = initalState, action: any) {
        switch(action.type){
            case ADD_MNEMONIC : return Object.assign({}, state, {
                mnemonic: initalState.mnemonic.concat(action.payload)
            });
            default : return state;
        }
    }
});
