import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface IDepositState {
    waitingForDeposit: boolean;
    isDepositDetected: boolean;
    depositTxData: string;
}

const initialState: IDepositState = {
    waitingForDeposit: false,
    isDepositDetected: false,
    depositTxData: "",
};

export const depositSlice = createSlice({
    name: "deposit",
    initialState,
    reducers: {
        storeDepositTx: (state, action: PayloadAction<string>): void => {
            state.depositTxData = action.payload;
        },
        waitForDeposit: (state): void => {
            state.waitingForDeposit = true;
        },
        depositNotFound: (state): void => {
            state.waitingForDeposit = false;
            state.isDepositDetected = false;
        },
        depositDetected: (state): void => {
            state.waitingForDeposit = false;
            state.isDepositDetected = true;
        },
        resetDepositData: (): IDepositState => initialState,
    },
});
