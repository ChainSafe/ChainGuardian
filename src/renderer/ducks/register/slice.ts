import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {networks} from "../../services/eth2/networks";

export interface IStoreValidatorKeysPayload {
    signingKey: string;
    withdrawalKey: string;
    signingKeyPath: string;
}

export interface IRegisterState {
    signingMnemonic: string,
    signingVerification: boolean,
    signingKey: string,
    signingKeyPath: string,
    withdrawalKey: string,
    network: string;
}

const initialState: IRegisterState = {
    signingMnemonic: "",
    signingVerification: false,
    signingKey: "",
    signingKeyPath: "",
    withdrawalKey: "",
    network: networks[0]?.networkName ?? "unknown",
};

export const registerSlice = createSlice({
    name: "register",
    initialState,
    reducers: {
        storeSigningMnemonic: (state, action: PayloadAction<string>): void => {
            state.signingMnemonic = action.payload;
        },
        storeSigningVerificationStatus: (state, action: PayloadAction<boolean>): void => {
            state.signingVerification = action.payload;
        },
        storeSigningKey: (state, action: PayloadAction<string>): void => {
            state.signingKey = action.payload;
        },
        storeValidatorKeys: {
            reducer: (
                state,
                action: PayloadAction<IStoreValidatorKeysPayload>
            ): void => {
                state.signingKey = action.payload.signingKey;
                state.withdrawalKey = action.payload.withdrawalKey;
                state.signingKeyPath = action.payload.signingKeyPath;
            },
            prepare: (signingKey: string, withdrawalKey: string, signingKeyPath: string):
            {payload: IStoreValidatorKeysPayload} => ({
                payload: {signingKey, withdrawalKey, signingKeyPath}
            }),
        },
        setNetwork: (state, action: PayloadAction<string>): void => {
            state.network = action.payload;
        },
        completedRegistrationSubmission: (): IRegisterState => initialState,
    },
});
