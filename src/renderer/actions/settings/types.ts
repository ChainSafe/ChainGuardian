import {ISettings} from "../../models/settings";

export enum SettingsActionTypes {
    SAVE_SETTINGS = "SAVE_SETTINGS"
}

export type SaveSettingsAction = {
    type: typeof SettingsActionTypes.SAVE_SETTINGS,
    payload: ISettings,
};

export type SettingsAction = SaveSettingsAction;
