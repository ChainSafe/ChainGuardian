import {createAction} from "@reduxjs/toolkit";
import {registerSlice} from "./slice";

export const {
    storeSigningKey,
    storeValidatorKeys,
    completedRegistrationSubmission,
    setNetwork,
    setKeystorePath,
    setPublicKey,
    setSlashingPath,
} = registerSlice.actions;

type AfterCreatePassword = (password: string, name?: string) => {payload: {password: string; name?: string}};
export const afterCreatePassword = createAction<AfterCreatePassword>(
    "register/afterCreatePassword",
    (password: string, name?: string) => ({payload: {password, name}}),
);

type AfterConfirmPassword = (password: string, name?: string) => {payload: {password: string; name?: string}};
export const afterConfirmPassword = createAction<AfterConfirmPassword>(
    "register/afterConfirmPassword",
    (password: string, name?: string) => ({payload: {password, name}}),
);
