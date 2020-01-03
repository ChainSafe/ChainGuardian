import {
    ISigningMnemonicAction, 
    ISigningVerificationStatusAction,
    ISigningKeyAction, 
    IWithdrawalMnemonicAction,
    IWithdrawalVerificationStatusAction,
    IWithdrawalKeyAction, 
} from "../actions";
import {RegisterActionTypes} from "../constants/action-types";
import {Action} from "redux";

export interface IRegisterState {
    signingMnemonic: string,
    signingVerification: boolean,
    signingKey: string,
    withdrawalMnemonic: string,
    withdrawalVerification: boolean,
    withdrawalKey: string,
}

const initialState: IRegisterState = {
    signingMnemonic: "",
    signingVerification: false,
    signingKey: "",
    withdrawalMnemonic: "",
    withdrawalVerification: false,
    withdrawalKey: "",
};

export const registerReducer = (state = initialState, action: Action<RegisterActionTypes>): IRegisterState => {
    switch (action.type) {

        case RegisterActionTypes.STORE_SIGNING_MNEMONIC:
            return Object.assign({}, state, {
                signingMnemonic: (action as ISigningMnemonicAction).payload.signingMnemonic
            });
        case RegisterActionTypes.STORE_SIGNING_VERIFICATION_STATUS:
            return Object.assign({}, state, {
                signingVerification: (action as ISigningVerificationStatusAction).payload.signingVerification
            });
        case RegisterActionTypes.STORE_SIGNING_KEY:
            return Object.assign({}, state, {
                signingKey: (action as ISigningKeyAction).payload.signingKey
            });

        case RegisterActionTypes.STORE_WITHDRAWAL_MNEMONIC:
            return Object.assign({}, state, {
                withdrawalMnemonic: (action as IWithdrawalMnemonicAction).payload.withdrawalMnemonic
            });
        case RegisterActionTypes.STORE_WITHDRAWAL_VERIFICATION_STATUS:
            return Object.assign({}, state, {
                withdrawalVerification: (action as IWithdrawalVerificationStatusAction).payload.withdrawalVerification
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