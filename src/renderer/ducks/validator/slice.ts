import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {ICGKeystore} from "../../services/keystore";
import {ValidatorStatus} from "../../constants/validatorStatus";
import {toHexString} from "@chainsafe/ssz";
import {ValidatorLogger} from "../../services/eth2/client/module";

export interface IValidator {
    name: string;
    status: ValidatorStatus;
    publicKey: string;
    network: string;
    balance?: bigint;
    syncingBalance?: boolean;
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
        loadedValidatorsBalance: (
            state,
            action: PayloadAction<{validator: {pubkey: Uint8Array; effectiveBalance: bigint}}[]>,
        ): void => {
            action.payload.forEach((response) => {
                const publicKey = toHexString(response.validator.pubkey);
                //TODO: not ok, we need to fetch balance from different endpoint
                state.byPublicKey[publicKey].balance = response.validator.effectiveBalance;
            });
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
        setValidatorIsRunning: {
            reducer: (state, action: PayloadAction<boolean, string, string>): void => {
                state.byPublicKey[action.meta].isRunning = true;
            },
            prepare: (isRunning: boolean, publicKey: string): {payload: boolean; meta: string} => ({
                payload: isRunning,
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
        setValidatorStatus: {
            reducer: (state, action: PayloadAction<ValidatorStatus, string, string>): void => {
                state.byPublicKey[action.meta].status = action.payload;
            },
            prepare: (status: ValidatorStatus, validator: string): {payload: ValidatorStatus; meta: string} => ({
                payload: status,
                meta: validator,
            }),
        },
        updateValidatorBalance: {
            reducer: (state, action: PayloadAction<bigint, string, string>): void => {
                state.byPublicKey[action.meta].balance = action.payload;
            },
            prepare: (publicKey: string, balance: bigint): {payload: bigint; meta: string} => ({
                payload: balance,
                meta: publicKey,
            }),
        },
    },
});
