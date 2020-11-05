import {createAction} from "@reduxjs/toolkit";
import {ISettings} from "../../models/settings";

export const saveAccountSettings = createAction<ISettings>("settings/saveAccountSettings");
