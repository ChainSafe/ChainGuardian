import database from "../../services/db/api/database";
import {DEFAULT_ACCOUNT} from "../../constants/account";
import {all, put, PutEffect, takeEvery} from "redux-saga/effects";
import {saveAccountSettings as saveAccountSettingsAction, setReporting} from "./actions";
import {postInit} from "../store";
import {ISettings, Settings} from "../../models/settings";
import {startMatomo, stopMatomo} from "../../services/tracking";

function* loadAccountSettings(): Generator<PutEffect | Promise<Settings | null>, void, Settings | null> {
    const settings = yield database.settings.get(DEFAULT_ACCOUNT);

    if (settings?.reporting !== undefined) yield put(setReporting(settings.reporting));
}

function* saveAccountSettings(action: {payload: ISettings}): Generator<PutEffect | Promise<void>> {
    yield database.settings.set(DEFAULT_ACCOUNT, action.payload);

    if (action.payload.reporting !== undefined) {
        yield put(setReporting(action.payload.reporting));

        if (action.payload.reporting) startMatomo();
        else stopMatomo();
    }
}

export function* settingsSagaWatcher(): Generator {
    yield all([takeEvery(postInit, loadAccountSettings), takeEvery(saveAccountSettingsAction, saveAccountSettings)]);
}
