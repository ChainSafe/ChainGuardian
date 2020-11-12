import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {networks} from "../../services/eth2/networks";

export interface IStoreValidatorKeysPayload {
    signingKey: string;
    withdrawalKey: string;
    signingKeyPath: string;
}

export interface IRegisterState {
    signingKey: string;
    signingKeyPath: string;
    withdrawalKey: string;
    network: string;
    path?: string;
    publicKey?: string;
    slashingPath?: string;
}

const initialState: IRegisterState = {
    signingKey: "",
    signingKeyPath: "",
    withdrawalKey: "",
    network: networks[0]?.networkName ?? "unknown",
};

export const registerSlice = createSlice({
    name: "register",
    initialState,
    reducers: {
        storeSigningKey: (state, action: PayloadAction<string>): void => {
            state.signingKey = action.payload;
        },
        storeValidatorKeys: {
            reducer: (state, action: PayloadAction<IStoreValidatorKeysPayload>): void => {
                state.signingKey = action.payload.signingKey;
                state.withdrawalKey = action.payload.withdrawalKey;
                state.signingKeyPath = action.payload.signingKeyPath;
            },
            prepare: (
                signingKey: string,
                withdrawalKey: string,
                signingKeyPath: string,
            ): {payload: IStoreValidatorKeysPayload} => ({
                payload: {signingKey, withdrawalKey, signingKeyPath},
            }),
        },
        setNetwork: (state, action: PayloadAction<string>): void => {
            state.network = action.payload;
        },
        setKeystorePath: (state, action: PayloadAction<string>): void => {
            state.path = action.payload;
        },
        setPublicKey: (state, action: PayloadAction<string>): void => {
            state.publicKey = action.payload;
        },
        setSlashingPath: (state, action: PayloadAction<string>): void => {
            state.slashingPath = action.payload;
        },
        completedRegistrationSubmission: (): IRegisterState => initialState,
    },
});
