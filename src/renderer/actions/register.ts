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
import {DEFAULT_ACCOUNT} from "../constants/account";
import {remote} from "electron";

//Login Authentication
export const storeAuthAction = (auth: CGAccount) =>
    (dispatch: Dispatch<IStoreAuthAction>): void => {
        dispatch(setAuth(auth));
    };
export const setAuth = (auth: CGAccount): IStoreAuthAction => ({
    type: RegisterActionTypes.STORE_AUTH, payload: {auth}
});
export interface IStoreAuthPayload {
    auth: CGAccount;
}
export interface IStoreAuthAction extends Action<RegisterActionTypes> {
    payload: IStoreAuthPayload;
}

//Signing actions
// Signing Mnemonic action
export const storeSigningMnemonicAction = (signingMnemonic: string) =>
    (dispatch: Dispatch<ISigningMnemonicAction>): void => {
        dispatch(setSigningMnemonic(signingMnemonic));
    };
export const setSigningMnemonic = (signingMnemonic: string): ISigningMnemonicAction => ({
    type: RegisterActionTypes.STORE_SIGNING_MNEMONIC, payload: {signingMnemonic}
});
export interface IStoreSigningMnemonicPayload {
    signingMnemonic: string;
}
export interface ISigningMnemonicAction extends Action<RegisterActionTypes> {
    payload: IStoreSigningMnemonicPayload;
}

// Signing Mnemonic Failed Verification
export const storeSigningVerificationStatusAction = (signingVerification: boolean) =>
    (dispatch: Dispatch<ISigningVerificationStatusAction>): void => {
        dispatch(setSigningVerificationStatus(signingVerification));
    };
export const setSigningVerificationStatus = (signingVerification: boolean): ISigningVerificationStatusAction => ({
    type: RegisterActionTypes.STORE_SIGNING_VERIFICATION_STATUS, payload: {signingVerification}
});
export interface IStoreSigningVerificationStatusPayload {
    signingVerification: boolean;
}
export interface ISigningVerificationStatusAction extends Action<RegisterActionTypes> {
    payload: IStoreSigningVerificationStatusPayload;
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
//Withdrawal actions
// Withdrawal Mnemonic action
export const storeWithdrawalMnemonicAction = (withdrawalMnemonic: string) =>
    (dispatch: Dispatch<IWithdrawalMnemonicAction>): void => {
        dispatch(setWithdrawalMnemonic(withdrawalMnemonic));
    };
export const setWithdrawalMnemonic = (withdrawalMnemonic: string): IWithdrawalMnemonicAction => ({
    type: RegisterActionTypes.STORE_WITHDRAWAL_MNEMONIC, payload: {withdrawalMnemonic}
});
export interface IStoreWithdrawalMnemonicPayload {
    withdrawalMnemonic: string;
}
export interface IWithdrawalMnemonicAction extends Action<RegisterActionTypes> {
    payload: IStoreWithdrawalMnemonicPayload;
}

// Withdrawal Mnemonic Failed Verification
export const storeWithdrawalVerificationStatusAction = (withdrawalVerification: boolean) =>
    (dispatch: Dispatch<IWithdrawalVerificationStatusAction>): void => {
        dispatch(setWithdrawalVerificationStatus(withdrawalVerification));
    };
export const setWithdrawalVerificationStatus=(withdrawalVerification: boolean): IWithdrawalVerificationStatusAction=>({
    type: RegisterActionTypes.STORE_WITHDRAWAL_VERIFICATION_STATUS, payload: {withdrawalVerification}
});
export interface IStoreWithdrawalVerificationStatusPayload {
    withdrawalVerification: boolean;
}
export interface IWithdrawalVerificationStatusAction extends Action<RegisterActionTypes> {
    payload: IStoreWithdrawalVerificationStatusPayload;
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
        const accountDirectory = path.join(getConfig(remote.app).storage.accountsDir, DEFAULT_ACCOUNT);
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