import {DEFAULT_ACCOUNT} from "../../constants/account";
import {authSlice} from "./slice";
import {createAction} from "@reduxjs/toolkit";

export const {storeAuth} = authSlice.actions;

export const requireAuthorization = createAction<(account?: string) => {payload: string}>(
    "auth/requireAuthorization", (account = DEFAULT_ACCOUNT) => ({payload: account}));
