import {Action, Dispatch} from "redux";
import {DEFAULT_ACCOUNT} from "../constants/account";
import {AccountSettingsActionTypes} from "../constants/action-types";
import {ISettings} from "../models/settings";
import database from "../services/db/api/database";

export const saveAccountSettings = (settings: ISettings) => {
    return async (dispatch: Dispatch<Action<unknown>>): Promise<void> => {
        await database.settings.set(
            DEFAULT_ACCOUNT,
            settings
        );

        dispatch({
            type: AccountSettingsActionTypes.SAVE_SETTINGS,
            payload: settings,
        });
    };
};
