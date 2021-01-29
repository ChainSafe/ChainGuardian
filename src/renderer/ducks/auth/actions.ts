import {authSlice} from "./slice";
import {createAction} from "@reduxjs/toolkit";

export const {storeAuth} = authSlice.actions;

export const reauthorize = createAction("auth/reauthorize");
