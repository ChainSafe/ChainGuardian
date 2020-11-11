import {depositSlice} from "./slice";
import {createAction} from "@reduxjs/toolkit";
import {INetworkConfig} from "../../services/interfaces";

export const {
    storeDepositTx,
    depositDetected,
    depositNotFound,
    waitForDeposit,
    resetDepositData,
} = depositSlice.actions;

export const generateDeposit = createAction<INetworkConfig>("deposit/generateDeposit");

interface IVerifyDepositPayload {
    networkConfig: INetworkConfig;
    timeout: number;
}
type VerifyDeposit = (networkConfig: INetworkConfig, timeout?: number) => {payload: IVerifyDepositPayload};
export const verifyDeposit = createAction<VerifyDeposit>(
    "deposit/verifyDeposit",
    (networkConfig: INetworkConfig, timeout = 30000) => ({payload: {networkConfig, timeout}}),
);
