import {SecretKey} from "@chainsafe/bls";
import {ValidatorNetwork} from "../../models/network";
import database from "../../services/db/api/database";
import {fromHex} from "../../services/utils/bytes";
import {saveKeystore, importKeystore} from "../../services/utils/account";
import {CGAccount} from "../../models/account";
import {DEFAULT_ACCOUNT} from "../../constants/account";
import {all, takeEvery, select, call, SelectEffect, CallEffect, put, PutEffect} from "redux-saga/effects";
import {afterConfirmPassword, afterCreatePassword, completedRegistrationSubmission} from "./actions";
import {addNewValidator} from "../validator/actions";
import {addNewValidatorSaga} from "../validator/sagas";
import {
    getKeystorePath,
    getPassword,
    getRegisterNetwork,
    getRegisterSigningKey,
    getRegisterSigningKeyPath,
    getName,
} from "./selectors";

function* afterCreatePasswordProcess({
    payload,
}: ReturnType<typeof afterCreatePassword>): Generator<SelectEffect | CallEffect, void, string> {
    const signingKeyData = yield select(getRegisterSigningKey);
    const signingKey = SecretKey.fromBytes(fromHex(signingKeyData));

    const name = yield select(getName);
    const keyPath = yield select(getRegisterSigningKeyPath);
    const accountDirectory = yield call(saveKeystore, signingKey, payload, keyPath, name);

    yield call(saveAccount, signingKey, accountDirectory);
}

function* afterConfirmPasswordProcess({
    payload,
}: ReturnType<typeof afterConfirmPassword>): Generator<SelectEffect | CallEffect, void, string> {
    const publicKey = yield select(getRegisterSigningKey);
    const fromPath = yield select(getKeystorePath);
    const password = yield select(getPassword);

    const name = yield select(getName);
    const accountDirectory = yield call(importKeystore, fromPath, publicKey, password, name, payload);

    yield call(saveAccount, publicKey, accountDirectory);
}

function* saveAccount(
    signingKey: PrivateKey | string,
    directory: string,
): Generator<CallEffect | Promise<void> | SelectEffect | PutEffect, void, string> {
    // Save account to db
    const account = new CGAccount({
        name: "Default",
        directory: directory,
        sendStats: false,
    });

    yield database.account.set(DEFAULT_ACCOUNT, account);

    // Save network
    const networkName = yield select(getRegisterNetwork);
    const network = new ValidatorNetwork(networkName);
    const validatorPubKey = typeof signingKey === "string" ? signingKey : signingKey.toPublicKey().toHexString();
    yield database.validator.network.set(validatorPubKey, network);

    const name = yield select(getName);
    yield call(addNewValidatorSaga, addNewValidator(validatorPubKey, name, account));

    yield put(completedRegistrationSubmission());
}

export function* registerSagaWatcher(): Generator {
    yield all([
        takeEvery(afterCreatePassword, afterCreatePasswordProcess),
        takeEvery(afterConfirmPassword, afterConfirmPasswordProcess),
    ]);
}
