import {IRegisterAction} from "../actions";
import {RegisterActionTypes} from "../constants/action-types";

export interface IRegisterState {
    mnemonic: string
}

const initalState: IRegisterState = {
    mnemonic: ""
};

export const registerReducer = (state = initalState, action: IRegisterAction): IRegisterState => {
    switch (action.type) {
        case RegisterActionTypes.STORE_SIGNING_KEY_MNEMONIC :
            return Object.assign({}, state, {
                mnemonic: action.payload.mnemonic
            });
        default :
            return state;
    }
};