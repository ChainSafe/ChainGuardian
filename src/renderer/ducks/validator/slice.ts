import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {ValidatorLogger} from "../../services/eth2/client/logger";
import {ICGKeystore} from "../../services/keystore";
import {ValidatorStatus} from "../../constants/validatorStatus";

export interface IValidator {
    name: string;
    status: ValidatorStatus;
    publicKey: string;
    network: string;
    balance?: bigint;
    keystore: ICGKeystore;
    isRunning: boolean;
    beaconNodes: string[];
}

export interface IValidatorComplete extends IValidator {
    logger?: ValidatorLogger;
}

export interface IByPublicKey {
    [publicKey: string]: IValidatorComplete;
}

export interface IValidatorState {
    byPublicKey: IByPublicKey;
    allPublicKeys: string[];
}

const initialState: IValidatorState = {
    byPublicKey: {},
    allPublicKeys: [],
};

export const validatorSlice = createSlice({
    name: "validator",
    initialState,
    reducers: {
        loadValidators: (state, action: PayloadAction<IValidator[]>): void => {
            action.payload.forEach((validator) => {
                state.byPublicKey[validator.publicKey] = validator;
                if (!state.allPublicKeys.some((key) => key === validator.publicKey)) {
                    state.allPublicKeys.push(validator.publicKey);
                }
            });
        },
        addValidator: (state, action: PayloadAction<IValidator>): void => {
            state.byPublicKey[action.payload.publicKey] = action.payload;
            if (!state.allPublicKeys.some((key) => key === action.payload.publicKey)) {
                state.allPublicKeys.push(action.payload.publicKey);
            }
        },
        removeValidator: (state, action: PayloadAction<string>): void => {
            delete state.byPublicKey[action.payload];
            const index = state.allPublicKeys.findIndex((key) => key === action.payload);
            if (index !== -1) {
                state.allPublicKeys.splice(index, 1);
            }
        },
        startValidatorService: {
            reducer: (state, action: PayloadAction<ValidatorLogger, string, string>): void => {
                state.byPublicKey[action.meta].isRunning = true;
                state.byPublicKey[action.meta].logger = action.payload;
            },
            prepare: (logger: ValidatorLogger, publicKey: string): {payload: ValidatorLogger; meta: string} => ({
                payload: logger,
                meta: publicKey,
            }),
        },
        storeValidatorBeaconNodes: {
            reducer: (state, action: PayloadAction<string[], string, string>): void => {
                state.byPublicKey[action.meta].beaconNodes = action.payload;
            },
            prepare: (beaconNodes: string[], publicKey: string): {payload: string[]; meta: string} => ({
                payload: beaconNodes,
                meta: publicKey,
            }),
        },
        stopValidatorService: (state, action: PayloadAction<string>): void => {
            state.byPublicKey[action.payload].isRunning = false;
        },
        loadValidatorStatus: {
            reducer: (state, action: PayloadAction<ValidatorStatus, string, string>): void => {
                state.byPublicKey[action.meta].status = action.payload;
            },
            prepare: (status: ValidatorStatus, validator: string): {payload: ValidatorStatus; meta: string} => ({
                payload: status,
                meta: validator,
            }),
        },
    },
});
