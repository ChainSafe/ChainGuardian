import {all, takeEvery, put, PutEffect} from "redux-saga/effects";
import {storeAuth, reauthorize} from "./actions";
import database from "../../services/db/api/database";
import {CGAccount} from "../../models/account";
import {DEFAULT_ACCOUNT} from "../../constants/account";
import {postInit} from "../store";
import {loadValidatorsAction} from "../validator/actions";
import {cgLogger} from "../../../main/logger";

export function* authorize(): Generator<Promise<CGAccount> | PutEffect, void, CGAccount | null> {
    try {
        const account = yield database.account.get(DEFAULT_ACCOUNT);
        if (account !== null) {
            cgLogger.info("Found Account with", account.getValidatorsAddresses().length, "validator/s");
            yield put(storeAuth(account));
            yield put(loadValidatorsAction());
        } else {
            cgLogger.info("Account not found");
        }
    } catch (e) {
        cgLogger.error(e);
    }
}

export function* authSagaWatcher(): Generator {
    yield all([takeEvery(postInit, authorize)]);
    yield all([takeEvery(reauthorize, authorize)]);
}
