import {ISigningKeyMnemonicAction, ISigningKeyAction, IWithdrawalKeyAction} from "../actions";
import {RegisterActionTypes} from "../constants/action-types";
import {Action} from "redux";

export interface IRegisterState {
    mnemonic: string,
    signingKey: string,
    withdrawalKey: string
}

const initialState: IRegisterState = {
    mnemonic: "",
    signingKey: "",
    withdrawalKey: ""
};

export const registerReducer = (state = initialState, action: Action<RegisterActionTypes>): IRegisterState => {
    switch (action.type) {
        case RegisterActionTypes.STORE_SIGNING_KEY_MNEMONIC:
            return Object.assign({}, state, {
                mnemonic: (action as ISigningKeyMnemonicAction).payload.mnemonic
            });
        case RegisterActionTypes.STORE_SIGNING_KEY:
            return Object.assign({}, state, {
                signingKey: (action as ISigningKeyAction).payload.signingKey
            });
        case RegisterActionTypes.STORE_WITHDRAWAL_KEY:
            return Object.assign({}, state, {
                withdrawalKey: (action as IWithdrawalKeyAction).payload.withdrawalKey
            });

        case RegisterActionTypes.COMPLETED_REGISTRATION_SUBMISSION:
            return Object.assign({}, state, initialState);
        default:
            return state;
    }
};