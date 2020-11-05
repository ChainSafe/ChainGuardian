import {all, takeEvery, put, PutEffect} from "redux-saga/effects";
import {requireAuthorization, storeAuth} from "./actions";
import database from "../../services/db/api/database";
import {CGAccount} from "../../models/account";
import {error} from "electron-log";

export function* authorize(action: ReturnType<typeof requireAuthorization>):
Generator<Promise<CGAccount> | PutEffect, void, CGAccount & null> {
    try {
        const account = yield database.account.get(action.payload);
        if (account !== null) {
            yield put(storeAuth(account));
        }
    } catch (e) {
        error(e);
    }
}

export function* authSagaWatcher(): Generator {
    yield all([
        takeEvery(requireAuthorization, authorize),
    ]);
}
