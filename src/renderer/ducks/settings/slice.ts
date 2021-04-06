import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface ISettingsState {
    initialBeacons: boolean;
    initialValidators: boolean;
    loadingValidator: boolean;
    reporting: boolean;
}

const initialState: ISettingsState = {
    initialBeacons: true,
    initialValidators: true,
    loadingValidator: false,
    reporting: false,
};

export const settingsSlice = createSlice({
    name: "settings",
    initialState,
    reducers: {
        setInitialBeacons: (state, action: PayloadAction<boolean>): void => {
            state.initialBeacons = action.payload;
        },
        setInitialValidators: (state, action: PayloadAction<boolean>): void => {
            state.initialValidators = action.payload;
            state.loadingValidator = false;
        },
        setLoadingValidator: (state, action: PayloadAction<boolean>): void => {
            state.loadingValidator = action.payload;
        },
        setReporting: (state, action: PayloadAction<boolean>): void => {
            state.reporting = action.payload;
        },
    },
});
