import {RegisterActionTypes} from "../constants/action-types";
import {Action, Dispatch} from "redux";
import {IRootState} from "../reducers";
import {V4Keystore} from "../services/keystore";
import {Keypair} from "@chainsafe/bls/lib/keypair";
import {PrivateKey} from "@chainsafe/bls/lib/privateKey";
import database from "../services/db/api/database";
import {CGAccount} from "../models/account";
import {getConfig} from "../../config/config";
import * as path from "path";
import {PublicKey} from "@chainsafe/bls/lib/publicKey";


// Mnemonic action
export const storeSigningKeyMnemonicAction = (mnemonic: string) =>
    (dispatch: Dispatch<ISigningKeyMnemonicAction>): void => {
        dispatch(setMnemonic(mnemonic));
    };

export const setMnemonic = (mnemonic: string): ISigningKeyMnemonicAction => ({
    type: RegisterActionTypes.STORE_SIGNING_KEY_MNEMONIC, payload: {mnemonic}
});

export interface IStoreSigningKeyMnemonicPayload {
    mnemonic: string;
}

export interface ISigningKeyMnemonicAction extends Action<RegisterActionTypes> {
    payload: IStoreSigningKeyMnemonicPayload;
}

// Signing key action
export const storeSigningKeyAction = (signingKey: string) =>
    (dispatch: Dispatch<ISigningKeyAction>): void => {
        dispatch(setSigningKey(signingKey));
    };

export const setSigningKey = (signingKey: string): ISigningKeyAction => ({
    type: RegisterActionTypes.STORE_SIGNING_KEY, payload: {signingKey}
});
export interface IStoreSigningKeyPayload {
    signingKey: string;
}

export interface ISigningKeyAction extends Action<RegisterActionTypes> {
    payload: IStoreSigningKeyPayload;
}

// Withdrawal key action
export const storeWithdrawalKeyAction = (withdrawalKey: string) =>
    (dispatch: Dispatch<IWithdrawalKeyAction>): void => {
        dispatch(setWithdrawalKey(withdrawalKey));
    };

export const setWithdrawalKey = (withdrawalKey: string): IWithdrawalKeyAction => ({
    type: RegisterActionTypes.STORE_WITHDRAWAL_KEY, payload: {withdrawalKey}
});
export interface IStoreWithdrawalKeyPayload {
    withdrawalKey: string;
}

export interface IWithdrawalKeyAction extends Action<RegisterActionTypes> {
    payload: IStoreWithdrawalKeyPayload;
}

// After password action
export const afterPasswordAction = (password: string) => {
    return async (dispatch: Dispatch<Action<RegisterActionTypes>>, getState: () => IRootState): Promise<void> => {
        // 1. Save to keystore
        dispatch(startRegistrationSubmission());
        const signingKey = PrivateKey.fromBytes(
            Buffer.from(getState().register.signingKey.slice(2), "hex")
        );
        const accountDirectory = path.join(getConfig().storage.accountsDir, "default");
        await V4Keystore.create(
            path.join(accountDirectory, PublicKey.fromPrivateKey(signingKey).toHexString() + ".json"),
            password, new Keypair(signingKey)
        );

        // 2. Save account to db
        const account = new CGAccount({
            name: "Default",
            directory: accountDirectory,
            sendStats: false
        });

        await database.account.set(
            "account",
            account
        );
        
        // 3. Delete keys from redux
        dispatch(completeRegistrationSubmission());
    };
};


export const startRegistrationSubmission = (): Action<RegisterActionTypes> => ({
    type: RegisterActionTypes.START_REGISTRATION_SUBMISSION
});

export const completeRegistrationSubmission = (): Action<RegisterActionTypes> => ({
    type: RegisterActionTypes.COMPLETED_REGISTRATION_SUBMISSION
});