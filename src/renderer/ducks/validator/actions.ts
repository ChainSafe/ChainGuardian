import {validatorSlice} from "./slice";
import {createAction} from "@reduxjs/toolkit";
import {CGAccount} from "../../models/account";
import {BlsKeypair} from "../../types/keys";

export const {
    addValidator,
    startValidatorService,
    loadValidators,
    loadValidatorStatus,
    removeValidator,
    stopValidatorService,
    storeValidatorBeaconNodes,
    updateValidatorBalance,
} = validatorSlice.actions;

export const loadValidatorsAction = createAction("validator/loadValidatorsAction");

type AddNewValidatorSaga = (
    publicKey: string,
    name: string,
    account: CGAccount,
) => {payload: {publicKey: string; name: string}; meta: CGAccount};
export const addNewValidator = createAction<AddNewValidatorSaga>(
    "validator/addNewValidator",
    (publicKey: string, name: string, account: CGAccount) => ({payload: {publicKey, name}, meta: account}),
);

type RemoveActiveValidator = (publicKey: string, validatorIndex: number) => {payload: string; meta: number};
export const removeActiveValidator = createAction<RemoveActiveValidator>(
    "validator/removeActiveValidator",
    (publicKey: string, validatorIndex: number) => ({payload: publicKey, meta: validatorIndex}),
);

type SetValidatorBeaconNode = (publicKey: string, beaconNode: string) => {payload: string; meta: string};
export const setValidatorBeaconNode = createAction<SetValidatorBeaconNode>(
    "validator/setValidatorBeaconNode",
    (publicKey: string, beaconNode: string) => ({payload: beaconNode, meta: publicKey}),
);

export const updateValidatorChainData = createAction<string>("validator/updateValidatorChainData");

export const updateValidatorStatus = createAction<string>("validator/updateValidatorStatus");

export const startNewValidatorService = createAction<BlsKeypair>("validator/startNewValidatorService");

export const stopActiveValidatorService = createAction<BlsKeypair>("validator/stopActiveValidatorService");
