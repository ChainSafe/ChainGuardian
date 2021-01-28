import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface ISettingsState {
    initialBeacons: boolean;
    initialValidators: boolean;
    loadingValidator: boolean;
}

const initialState: ISettingsState = {
    initialBeacons: true,
    initialValidators: true,
    loadingValidator: false,
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
        },
        setLoadingValidator: (state, action: PayloadAction<boolean>): void => {
            state.loadingValidator = action.payload;
        },
    },
});
