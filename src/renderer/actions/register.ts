import {RegisterActionTypes} from "../constants/action-types";
import {Action, Dispatch} from "redux";

export const storeSigningKeyMnemonicAction = (mnemonic: string) => (dispatch: Dispatch<IRegisterAction>): void => {
    dispatch({type: RegisterActionTypes.STORE_SIGNING_KEY_MNEMONIC, payload: {mnemonic}});
};

export interface IStoreSigningKeyMnemonicPayload {
    mnemonic: string;
}

export interface IRegisterAction extends Action<RegisterActionTypes>{
    payload: IStoreSigningKeyMnemonicPayload;
}