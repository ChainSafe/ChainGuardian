import {createAction} from "@reduxjs/toolkit";
import {ISettings} from "../../models/settings";
import {settingsSlice} from "./slice";

export const {setInitialBeacons, setInitialValidators, setLoadingValidator, setReporting} = settingsSlice.actions;

export const saveAccountSettings = createAction<ISettings>("settings/saveAccountSettings");
