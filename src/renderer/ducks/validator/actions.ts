import {validatorSlice} from "./slice";
import {createAction} from "@reduxjs/toolkit";
import {Keypair} from "@chainsafe/bls";
import {CGAccount} from "../../models/account";

export const {
    addValidator,
    startValidatorService,
    loadValidators,
    loadedValidatorsBalance,
    loadValidatorStatus,
    removeValidator,
    stopValidatorService,
} = validatorSlice.actions;

export const loadValidatorsAction = createAction("validator/loadValidatorsAction");

type AddNewValidatorSaga = (publicKey: string, account: CGAccount) => {payload: string; meta: CGAccount};
export const addNewValidator = createAction<AddNewValidatorSaga>(
    "validator/addNewValidator",
    (publicKey: string, account: CGAccount) => ({payload: publicKey, meta: account}),
);

type RemoveActiveValidator = (publicKey: string, validatorIndex: number) => {payload: string; meta: number};
export const removeActiveValidator = createAction<RemoveActiveValidator>(
    "validator/removeActiveValidator",
    (publicKey: string, validatorIndex: number) => ({payload: publicKey, meta: validatorIndex}),
);

export const updateValidatorChainData = createAction<string>("validator/updateValidatorChainData");

export const updateValidatorsFromChain = createAction<string[]>("validator/updateValidatorsFromChain");

export const updateValidatorStatus = createAction<string>("validator/updateValidatorStatus");

export const startNewValidatorService = createAction<Keypair>("validator/startNewValidatorService");

export const stopActiveValidatorService = createAction<Keypair>("validator/stopActiveValidatorService");
