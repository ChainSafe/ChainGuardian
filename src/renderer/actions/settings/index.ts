import {ISettings} from "../../models/settings";
import {Dispatch} from "redux";
import database from "../../services/db/api/database";
import {DEFAULT_ACCOUNT} from "../../constants/account";
import {SaveSettingsAction, SettingsActionTypes} from "./types";

export * from "./types";

export const saveAccountSettings = (settings: ISettings) => {
    return async (dispatch: Dispatch<SaveSettingsAction>): Promise<void> => {
        await database.settings.set(
            DEFAULT_ACCOUNT,
            settings
        );

        dispatch({
            type: SettingsActionTypes.SAVE_SETTINGS,
            payload: settings,
        });
    };
};
