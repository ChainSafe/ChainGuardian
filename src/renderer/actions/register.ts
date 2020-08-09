import {RegisterActionTypes} from "../constants/action-types";
import {Action, Dispatch} from "redux";
import {ValidatorNetwork} from "../models/network";
import {IRootState} from "../reducers";
import {PrivateKey} from "@chainsafe/bls";
import database from "../services/db/api/database";
import {CGAccount} from "../models/account";
import {DEFAULT_ACCOUNT} from "../constants/account";
import {saveKeystore} from "../services/utils/account";
import {fromHex} from "../services/utils/bytes";
import {addNewValidator} from "./validator";
import {wordlists} from "bip39";
import {randBetween} from "@chainsafe/lodestar-utils";

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

export const storeValidatorKeysAction = ((signingKey: string, withdrawalKey: string, signingKeyPath: string) =>
    (dispatch: Dispatch<IStoreValidatorKeysAction>): void => {
        dispatch(setValidatorKeys(signingKey, withdrawalKey, signingKeyPath));
    });

export const setValidatorKeys =
    (signingKey: string, withdrawalKey: string, signingKeyPath: string): IStoreValidatorKeysAction => ({
        type: RegisterActionTypes.STORE_VALIDATOR_KEYS, payload: {signingKey, withdrawalKey, signingKeyPath}
    });
export type StoreValidatorKeysPayload = {
    signingKey: string;
    withdrawalKey: string;
    signingKeyPath: string;
};
export interface IStoreValidatorKeysAction extends Action<RegisterActionTypes> {
    payload: StoreValidatorKeysPayload;
}
export const storeSigningKeyAction = ((signingKey: string) =>
    (dispatch: Dispatch<IStoreSigningKeyAction>): void => {
        dispatch(setSigningKey(signingKey));
    });

export const setSigningKey = (signingKey: string): IStoreSigningKeyAction => ({
    type: RegisterActionTypes.STORE_SIGNING_KEY, payload: {signingKey}
});
export type StoreSigningKeyPayload = {
    signingKey: string;
};
export interface IStoreSigningKeyAction extends Action<RegisterActionTypes> {
    payload: StoreSigningKeyPayload;
}


const saveNetwork = async(signingKey: PrivateKey, networkName: string): Promise<void> => {
    const network = new ValidatorNetwork(networkName);
    const validatorPubKey = signingKey.toPublicKey().toHexString();
    await database.validator.network.set(validatorPubKey, network);
};

// After password action
export const afterPasswordAction = (password: string, name?: string) => {
    return async (dispatch: Dispatch<Action<unknown>>, getState: () => IRootState): Promise<void> => {
        const signingKey = PrivateKey.fromBytes(fromHex(getState().register.signingKey));
        // 1. Save to keystore
        dispatch(startRegistrationSubmission());
        const englishWordList = wordlists["english"];
        const accountDirectory = await saveKeystore(
            signingKey,
            password,
            getState().register.signingKeyPath,
            name ?? "Validator " + englishWordList[randBetween(0, englishWordList.length - 1)]
        );

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

        addNewValidator(signingKey.toPublicKey().toHexString(), account)(dispatch);

        dispatch(completeRegistrationSubmission());
    };
};


export const startRegistrationSubmission = (): Action<RegisterActionTypes> => ({
    type: RegisterActionTypes.START_REGISTRATION_SUBMISSION
});

export const completeRegistrationSubmission = (): Action<RegisterActionTypes> => ({
    type: RegisterActionTypes.COMPLETED_REGISTRATION_SUBMISSION
});


export interface ISetNetworkAction {
    type: typeof RegisterActionTypes.SET_NETWORK;
    payload: string;
}
export const setNetworkAction = (network: string): ISetNetworkAction => ({
    type: RegisterActionTypes.SET_NETWORK,
    payload: network,
});
