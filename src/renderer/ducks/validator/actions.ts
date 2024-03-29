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
    setValidatorIsRunning,
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

export type SignedNewAttestation = (
    publicKey: string,
    block: string,
    index: number,
    slot: number,
    validatorIndexInCommittee: number,
) => {
    payload: {block: string; index: number; slot: number; validatorIndexInCommittee: number};
    meta: string;
};
export const signedNewAttestation = createAction<SignedNewAttestation>(
    "validator/signedNewAttestation",
    (publicKey: string, block: string, index: number, slot: number, validatorIndexInCommittee: number) => ({
        payload: {block, index, slot, validatorIndexInCommittee},
        meta: publicKey,
    }),
);

export type PublishNewBlock = (
    publicKey: string,
    index: number,
    slot: number,
) => {
    payload: {index: number; slot: number};
    meta: string;
};
export const publishNewBlock = createAction<PublishNewBlock>(
    "validator/publishNewBlock",
    (publicKey: string, index: number, slot: number) => ({
        payload: {index, slot},
        meta: publicKey,
    }),
);

export type ExportValidator = (
    path: string,
    publicKey: string,
) => {
    payload: string;
    meta: string;
};
export const exportValidator = createAction<ExportValidator>(
    "validator/exportValidator",
    (path: string, publicKey: string) => ({payload: path, meta: publicKey}),
);

export const startValidatorDutiesWatcher = createAction<string>("validator/startValidatorDutiesWatcher");
