import database from "../../services/db/api/database";
import {DEFAULT_ACCOUNT} from "../../constants/account";
import {all, takeEvery, call, CallEffect} from "redux-saga/effects";
import {saveAccountSettings as saveAccountSettingsAction} from "./actions";

function* saveAccountSettings(action: ReturnType<typeof saveAccountSettingsAction>): Generator<CallEffect> {
    yield call(database.settings.set, DEFAULT_ACCOUNT, action.payload);

    // yield put(); some settings redux store function
}

export function* registerSagaWatcher(): Generator {
    yield all([
        takeEvery(saveAccountSettingsAction, saveAccountSettings),
    ]);
}
