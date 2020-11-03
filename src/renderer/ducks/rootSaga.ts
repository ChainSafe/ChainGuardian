import {all} from "redux-saga/effects";
import {authSagaWatcher} from "./auth/sagas";
import {depositSagaWatcher} from "./deposit/sagas";
import {networkSagaWatcher} from "./network/sagas";
import {notificationSagaWatcher} from "./notification/sagas";
import {registerSagaWatcher} from "./register/sagas";
import {settingsSagaWatcher} from "./settings/sagas";
import {validatorSagaWatcher} from "./validator/sagas";

export function* rootSaga(): Generator {
    yield all([
        authSagaWatcher(),
        depositSagaWatcher(),
        networkSagaWatcher(),
        notificationSagaWatcher(),
        registerSagaWatcher(),
        settingsSagaWatcher(),
        validatorSagaWatcher(),
    ]);
}
