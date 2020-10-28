export enum RegisterActionTypes {
    STORE_SIGNING_MNEMONIC = "STORE_SIGNING_MNEMONIC",
    STORE_SIGNING_VERIFICATION_STATUS = "STORE_SIGNING_VERIFICATION_STATUS",
    STORE_SIGNING_KEY = "STORE_SIGNING_KEY",
    STORE_VALIDATOR_KEYS = "STORE_VALIDATOR_KEYS",
    START_REGISTRATION_SUBMISSION = "START_REGISTRATION_SUBMISSION",
    COMPLETED_REGISTRATION_SUBMISSION = "COMPLETED_REGISTRATION_SUBMISSION",
    SET_NETWORK = "SET_NETWORK",
}

export type StoreSigningMnemonicAction = {
    type: typeof RegisterActionTypes.STORE_SIGNING_MNEMONIC
    payload: {
        signingMnemonic: string;
    }
};

export type StoreSigningVerificationStatusAction = {
    type: typeof RegisterActionTypes.STORE_SIGNING_VERIFICATION_STATUS
    payload: {
        signingVerification: boolean;
    };
};

export type StoreValidatorKeysPayload = {

};
export type StoreValidatorKeysAction = {
    type: typeof RegisterActionTypes.STORE_VALIDATOR_KEYS
    payload: {
        signingKey: string;
        withdrawalKey: string;
        signingKeyPath: string;
    };
};

export type StoreSigningKeyAction = {
    type: typeof RegisterActionTypes.STORE_SIGNING_KEY
    payload: {
        signingKey: string;
    };
};

export type SetNetworkAction = {
    type: typeof RegisterActionTypes.SET_NETWORK;
    payload: string;
};

export type StartRegistrationSubmissionAction = {
    type: typeof RegisterActionTypes.START_REGISTRATION_SUBMISSION
};

export type CompletedRegistrationSubmissionAction = {
    type: typeof RegisterActionTypes.COMPLETED_REGISTRATION_SUBMISSION
};

export type RegisterAction =
    StoreSigningMnemonicAction
    | StoreSigningVerificationStatusAction
    | StoreValidatorKeysAction
    | StoreSigningKeyAction
    | SetNetworkAction
    | StartRegistrationSubmissionAction
    | CompletedRegistrationSubmissionAction;
