import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {CGAccount} from "../../models/account";

interface IAuthState {
    account: CGAccount | null,
}

const initialState: IAuthState = {account: null};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        storeAuth: (state, action: PayloadAction<CGAccount>): void => {
            state.account = action.payload;
        },
    },
});
