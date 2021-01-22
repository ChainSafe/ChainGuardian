import {validatorSlice} from "./slice";
import {createAction} from "@reduxjs/toolkit";
import {CGAccount} from "../../models/account";
import {BlsKeypair} from "../../types";

export const {
    addValidator,
    startValidatorService,
    loadValidators,
    setValidatorStatus,
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

type SetValidatorBeaconNode = (publicKey: string, beaconNodes: string[]) => {payload: string[]; meta: string};
export const setValidatorBeaconNode = createAction<SetValidatorBeaconNode>(
    "validator/setValidatorBeaconNode",
    (publicKey: string, beaconNodes: string[]) => ({payload: beaconNodes, meta: publicKey}),
);

export const updateValidatorChainData = createAction<string>("validator/updateValidatorChainData");

export const updateValidatorStatus = createAction<string>("validator/updateValidatorStatus");

type StartNewValidatorService = (
    keypair: BlsKeypair,
    openModal: () => void,
    closeModal: () => void,
) => {payload: BlsKeypair; meta: {openModal: () => void; closeModal: () => void}};
export const startNewValidatorService = createAction<StartNewValidatorService>(
    "validator/startNewValidatorService",
    (keypair: BlsKeypair, openModal: () => void, closeModal: () => void) => ({
        payload: keypair,
        meta: {openModal, closeModal},
    }),
);

export const stopActiveValidatorService = createAction<BlsKeypair>("validator/stopActiveValidatorService");

export const slashingProtectionUpload = createAction<string>("validator/slashingProtectionUpload");

export const slashingProtectionSkip = createAction("validator/slashingProtectionSkip");

export const slashingProtectionCancel = createAction("validator/slashingProtectionCancel");

export type GetNewValidatorBalance = (
    beacon: string,
    slot: number,
    epoch: number,
) => {
    payload: {beacon: string; slot: number; epoch: number};
};
export const getNewValidatorBalance = createAction<GetNewValidatorBalance>(
    "validator/getNewValidatorBalance",
    (beacon: string, slot: number, epoch: number) => ({
        payload: {beacon, slot, epoch},
    }),
);
