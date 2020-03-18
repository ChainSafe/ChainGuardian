import {RegisterActionTypes} from "../constants/action-types";
import {Action, Dispatch} from "redux";
import {ValidatorNetwork} from '../models/network';
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
import {fromHex} from "../services/utils/bytes";
import {storeAuthAction} from "./auth";

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

const saveKeystore = async(state: IRootState, password: string): Promise<string> => {
    const signingKey = PrivateKey.fromBytes(fromHex(state.register.signingKey));
    const accountDirectory = path.join(getConfig(remote.app).storage.accountsDir, DEFAULT_ACCOUNT);
    await V4Keystore.create(
        path.join(accountDirectory, PublicKey.fromPrivateKey(signingKey).toHexString() + ".json"),
        password, new Keypair(signingKey)
    );

    return accountDirectory;
};

const saveNetwork = async(state: IRootState): Promise<void> => {
    const networkName = state.network.selected;
    if (networkName) {
        const network = new ValidatorNetwork(networkName);
        const validatorAddress = PublicKey.fromBytes(fromHex(state.register.signingKey)).toHexString();
        await database.validator.network.set(validatorAddress, network);
    }
};

// After password action
export const afterPasswordAction = (password: string) => {
    return async (dispatch: Dispatch<Action<unknown>>, getState: () => IRootState): Promise<void> => {
        // 1. Save to keystore
        dispatch(startRegistrationSubmission());
        const accountDirectory = await saveKeystore(getState(), password);

        // 2. Save account to db
        const account = new CGAccount({
            name: "Default",
            directory: accountDirectory,
            sendStats: false
        });

        await database.account.set(
            DEFAULT_ACCOUNT,
            account
        );

        // 3. Save network
        await saveNetwork(getState());

        dispatch(completeRegistrationSubmission());
    };
};


export const startRegistrationSubmission = (): Action<RegisterActionTypes> => ({
    type: RegisterActionTypes.START_REGISTRATION_SUBMISSION
});

export const completeRegistrationSubmission = (): Action<RegisterActionTypes> => ({
    type: RegisterActionTypes.COMPLETED_REGISTRATION_SUBMISSION
});

export const addNewValidatorAction = (password: string) => {
    return async (dispatch: Dispatch<Action<unknown>>, getState: () => IRootState): Promise<void> => {
        await Promise.all([
            // Add new validator to database
            saveKeystore(getState(), password),
            // Save validator's network
            saveNetwork(getState())
        ]);

        const account = getState().auth.account;
        if (account !== null) {
            // Reload validators and beacon nodes
            await account.unlock(password);
            storeAuthAction(account)(dispatch);
        }

        dispatch(completeAddingNewValidator());
    };
};


export const startAddingNewValidator = (): Action<RegisterActionTypes> => ({
    type: RegisterActionTypes.START_ADDING_NEW_VALIDATOR
});

export const completeAddingNewValidator = (): Action<RegisterActionTypes> => ({
    type: RegisterActionTypes.COMPLETE_ADDING_NEW_VALIDATOR
});

export interface ISetNetworkAction {
    type: typeof RegisterActionTypes.SET_NETWORK;
    payload: string;
}
export const setNetworkAction = (network: string): ISetNetworkAction => ({
    type: RegisterActionTypes.SET_NETWORK,
    payload: network,
});