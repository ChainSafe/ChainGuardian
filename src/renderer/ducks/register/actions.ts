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
    setPassword,
    storeKeystoreValues,
    setName,
} = registerSlice.actions;

export const afterCreatePassword = createAction<string>("register/afterCreatePassword");

export const afterConfirmPassword = createAction<string>("register/afterConfirmPassword");
