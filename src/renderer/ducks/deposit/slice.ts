import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {verifyDeposit} from "./actions";

interface IDepositState {
    waitingForDeposit: boolean;
    isDepositDetected: boolean;
    depositTxData: string;
}

const initialState: IDepositState = {
    waitingForDeposit: false,
    isDepositDetected: false,
    depositTxData: ""
};

export const depositSlice = createSlice({
    name: "deposit",
    initialState,
    reducers: {
        storeDepositTx: (state, action: PayloadAction<string>): void => {
            state.depositTxData = action.payload;
        },
        // TODO: decide what approach to use #1
        waitForDeposit: (state): void => {
            state.waitingForDeposit = true;  
        },
        depositNotFount: (state): void => {
            state.waitingForDeposit = false;
            state.isDepositDetected = false;
        },
        depositDetected: (state): void => {
            state.waitingForDeposit = false;
            state.isDepositDetected = true;
        }
    },
    // TODO: decide what approach to use #1
    extraReducers: (builder): void => {
        builder.addCase(verifyDeposit, (state): void => {
            state.waitingForDeposit = true;
        });
    },
});
