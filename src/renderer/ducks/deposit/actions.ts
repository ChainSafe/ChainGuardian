import {depositSlice} from "./slice";
import {createAction} from "@reduxjs/toolkit";
import {INetworkConfig} from "../../services/interfaces";

export const {storeDepositTx, depositDetected, depositNotFount, waitForDeposit} = depositSlice.actions;

export const generateDeposit = createAction<INetworkConfig>("deposit/generateDeposit");

type VerifyDeposit = (networkConfig: INetworkConfig, timeout?: number) =>
{payload: {networkConfig: INetworkConfig; timeout: number}};
export const verifyDeposit = createAction<VerifyDeposit>(
    "deposit/verifyDeposit", (networkConfig: INetworkConfig, timeout = 30000) => ({payload: {networkConfig, timeout}}),
);
