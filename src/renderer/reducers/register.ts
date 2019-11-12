import {ADD_MNEMONIC} from "../constants/action-types";

export interface IRegisterState {
    mnemonic: string,
    state: string,
    action: any
}

const initalState = {
    mnemonic: ""
};

export const mnemonicReducer = (state = initalState, action: any) => (

        switch(action.type){
            case ADD_MNEMONIC : return Object.assign({}, state, {
                mnemonic: initalState.mnemonic.concat(action.payload)
            });
            default : return state;
        }
);