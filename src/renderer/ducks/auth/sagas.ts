import {all, takeEvery, put, PutEffect} from "redux-saga/effects";
import {storeAuth} from "./actions";
import database from "../../services/db/api/database";
import {CGAccount} from "../../models/account";
import {error} from "electron-log";
import {DEFAULT_ACCOUNT} from "../../constants/account";
import {postInit} from "../store";
import {loadValidatorsAction} from "../validator/actions";

export function* authorize(): Generator<Promise<CGAccount> | PutEffect, void, CGAccount & null> {
    try {
        const account = yield database.account.get(DEFAULT_ACCOUNT);
        if (account !== null) {
            yield put(storeAuth(account));
            yield put(loadValidatorsAction());
        }
    } catch (e) {
        error(e);
    }
}

export function* authSagaWatcher(): Generator {
    yield all([takeEvery(postInit, authorize)]);
}
