import {RegisterActionTypes} from "../constants/action-types";
import {Action, Dispatch} from "redux";
import {ValidatorNetwork} from "../models/network";
import {IRootState} from "../reducers";
import {V4Keystore} from "../services/keystore";
import {Keypair, PrivateKey, PublicKey} from "@chainsafe/bls";
import database from "../services/db/api/database";
import {CGAccount} from "../models/account";
import {getConfig} from "../../config/config";
import * as path from "path";
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

const saveKeystore = async(signingKey: PrivateKey, password: string): Promise<string> => {
    const accountDirectory = path.join(getConfig(remote.app).storage.accountsDir, DEFAULT_ACCOUNT);
    await V4Keystore.create(
        path.join(accountDirectory, PublicKey.fromPrivateKey(signingKey).toHexString() + ".json"),
        password, new Keypair(signingKey)
    );

    return accountDirectory;
};

const saveNetwork = async(signingKey: PrivateKey, networkName: string): Promise<void> => {
    const network = new ValidatorNetwork(networkName);
    const validatorPubKey = signingKey.toPublicKey().toHexString();
    await database.validator.network.set(validatorPubKey, network);
};

// After password action
export const afterPasswordAction = (password: string) => {
    return async (dispatch: Dispatch<Action<unknown>>, getState: () => IRootState): Promise<void> => {
        const signingKey = PrivateKey.fromBytes(fromHex(getState().register.signingKey));
        // 1. Save to keystore
        dispatch(startRegistrationSubmission());
        const accountDirectory = await saveKeystore(signingKey, password);

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
        await saveNetwork(signingKey, getState().register.network);

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
        const signingKey = PrivateKey.fromBytes(fromHex(getState().register.signingKey));
        const state = getState();

        // Add new validator to database
        await saveKeystore(signingKey, password);
        // Save validator's network
        await saveNetwork(signingKey, state.register.network);

        const account = state.auth.account;
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