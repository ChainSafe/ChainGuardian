import {createAction} from "@reduxjs/toolkit";
import {registerSlice} from "./slice";

export const {
    storeSigningKey, storeSigningMnemonic, storeSigningVerificationStatus, storeValidatorKeys,
    completedRegistrationSubmission, setNetwork,
} = registerSlice.actions;

type AfterPassword = (password: string, name?: string) => {payload: {password: string, name?: string}};
export const afterPassword = createAction<AfterPassword>(
    "register/afterPassword",(password: string, name?: string) => ({payload: {password, name}}),
);
