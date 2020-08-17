import {Dispatch} from "redux";
import {
    CompletedRegistrationSubmissionAction,
    RegisterAction,
    RegisterActionTypes,
    SetNetworkAction,
    StartRegistrationSubmissionAction,
    StoreSigningKeyAction,
    StoreSigningMnemonicAction,
    StoreSigningVerificationStatusAction,
    StoreValidatorKeysAction
} from "./types";
import {PrivateKey} from "@chainsafe/bls";
import {ValidatorNetwork} from "../../models/network";
import database from "../../services/db/api/database";
import {IRootState} from "../../reducers";
import {fromHex} from "../../services/utils/bytes";
import {wordlists} from "bip39";
import {saveKeystore} from "../../services/utils/account";
import {randBetween} from "@chainsafe/lodestar-utils";
import {CGAccount} from "../../models/account";
import {DEFAULT_ACCOUNT} from "../../constants/account";
import {addNewValidator, AddValidatorAction} from "../validator";

export * from "./types";

// Signing Mnemonic action
export const storeSigningMnemonicAction = (signingMnemonic: string) =>
    (dispatch: Dispatch<StoreSigningMnemonicAction>): void => {
        dispatch(setSigningMnemonic(signingMnemonic));
    };

export const setSigningMnemonic = (signingMnemonic: string): StoreSigningMnemonicAction => ({
    type: RegisterActionTypes.STORE_SIGNING_MNEMONIC, payload: {signingMnemonic}
});


// Signing Mnemonic Failed Verification
export const storeSigningVerificationStatusAction = (signingVerification: boolean) =>
    (dispatch: Dispatch<StoreSigningVerificationStatusAction>): void => {
        dispatch(setSigningVerificationStatus(signingVerification));
    };
export const setSigningVerificationStatus = (signingVerification: boolean): StoreSigningVerificationStatusAction => ({
    type: RegisterActionTypes.STORE_SIGNING_VERIFICATION_STATUS, payload: {signingVerification}
});

export const storeValidatorKeysAction = ((signingKey: string, withdrawalKey: string, signingKeyPath: string) =>
    (dispatch: Dispatch<StoreValidatorKeysAction>): void => {
        dispatch(setValidatorKeys(signingKey, withdrawalKey, signingKeyPath));
    });

export const setValidatorKeys =
    (signingKey: string, withdrawalKey: string, signingKeyPath: string): StoreValidatorKeysAction => ({
        type: RegisterActionTypes.STORE_VALIDATOR_KEYS, payload: {signingKey, withdrawalKey, signingKeyPath}
    });

export const storeSigningKeyAction = ((signingKey: string) =>
    (dispatch: Dispatch<StoreSigningKeyAction>): void => {
        dispatch(setSigningKey(signingKey));
    });

export const setSigningKey = (signingKey: string): StoreSigningKeyAction => ({
    type: RegisterActionTypes.STORE_SIGNING_KEY, payload: {signingKey}
});

const saveNetwork = async(signingKey: PrivateKey, networkName: string): Promise<void> => {
    const network = new ValidatorNetwork(networkName);
    const validatorPubKey = signingKey.toPublicKey().toHexString();
    await database.validator.network.set(validatorPubKey, network);
};

// After password action
export const afterPasswordAction = (password: string, name?: string) => {
    return async (dispatch: Dispatch<RegisterAction|AddValidatorAction>, getState: () => IRootState): Promise<void> => {
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

        await addNewValidator(signingKey.toPublicKey().toHexString(), account)(dispatch);

        dispatch(completeRegistrationSubmission());
    };
};


export const startRegistrationSubmission = (): StartRegistrationSubmissionAction => ({
    type: RegisterActionTypes.START_REGISTRATION_SUBMISSION
});

export const completeRegistrationSubmission = (): CompletedRegistrationSubmissionAction => ({
    type: RegisterActionTypes.COMPLETED_REGISTRATION_SUBMISSION
});

export const setNetworkAction = (network: string): SetNetworkAction => ({
    type: RegisterActionTypes.SET_NETWORK,
    payload: network,
});

