import {all, takeEvery, put, PutEffect} from "redux-saga/effects";
import {storeAuth} from "./actions";
import database from "../../services/db/api/database";
import {CGAccount} from "../../models/account";
import {DEFAULT_ACCOUNT} from "../../constants/account";
import {postInit} from "../store";
import {loadValidatorsAction} from "../validator/actions";
import {chainGuardianLogger} from "../../../main/logger";

export function* authorize(): Generator<Promise<CGAccount> | PutEffect, void, CGAccount | null> {
    try {
        const account = yield database.account.get(DEFAULT_ACCOUNT);
        if (account !== null) {
            chainGuardianLogger.info("Found Account with", account.getValidatorsAddresses().length, "validator/s");
            yield put(storeAuth(account));
            yield put(loadValidatorsAction());
        } else {
            chainGuardianLogger.info("Account not found");
        }
    } catch (e) {
        chainGuardianLogger.error(e);
    }
}

export function* authSagaWatcher(): Generator {
    yield all([takeEvery(postInit, authorize)]);
}
