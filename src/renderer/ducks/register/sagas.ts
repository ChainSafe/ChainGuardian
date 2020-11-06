import {PrivateKey} from "@chainsafe/bls";
import {ValidatorNetwork} from "../../models/network";
import database from "../../services/db/api/database";
import {fromHex} from "../../services/utils/bytes";
import {wordlists} from "bip39";
import {saveKeystore, importKeystore} from "../../services/utils/account";
import {randBetween} from "@chainsafe/lodestar-utils";
import {CGAccount} from "../../models/account";
import {DEFAULT_ACCOUNT} from "../../constants/account";
import {all, takeEvery, select, call, SelectEffect, CallEffect} from "redux-saga/effects";
import {afterConfirmPassword, afterCreatePassword} from "./actions";
import {addNewValidator} from "../validator/actions";
import {addNewValidatorSaga} from "../validator/sagas";
import {getKeystorePath, getRegisterNetwork, getRegisterSigningKey, getRegisterSigningKeyPath} from "./selectors";

function* afterCreatePasswordProcess({payload: {password, name}}: ReturnType<typeof afterCreatePassword>):
Generator<SelectEffect | CallEffect, void, string> {
    const signingKeyData = yield select(getRegisterSigningKey);
    const signingKey = PrivateKey.fromBytes(fromHex(signingKeyData));

    const englishWordList = wordlists["english"];
    const keyPath = yield select(getRegisterSigningKeyPath);
    const accountDirectory = yield call(
        saveKeystore,
        signingKey,
        password,
        keyPath,
        name ?? "Validator " + englishWordList[randBetween(0, englishWordList.length - 1)]
    );

    yield call(saveAccount, signingKey, accountDirectory);
}

function* afterConfirmPasswordProcess({payload: {password, name}}: ReturnType<typeof afterConfirmPassword>):
Generator<SelectEffect | CallEffect, void, string> {
    const signingKeyData = yield select(getRegisterSigningKey);
    const signingKey = PrivateKey.fromBytes(fromHex(signingKeyData));
    const fromPath = yield select(getKeystorePath);

    const englishWordList = wordlists["english"];
    const accountDirectory = yield call(
        importKeystore,
        fromPath,
        signingKey,
        password,
        name ?? "Validator " + englishWordList[randBetween(0, englishWordList.length - 1)]
    );

    yield call(saveAccount, signingKey, accountDirectory);
}

function* saveAccount(signingKey: PrivateKey, directory: string):
Generator<CallEffect | Promise<void> | SelectEffect, void, string> {
    // Save account to db
    const account = new CGAccount({
        name: "Default",
        directory: directory,
        sendStats: false
    });

    yield database.account.set(DEFAULT_ACCOUNT, account);

    // Save network
    const networkName = yield select(getRegisterNetwork);
    const network = new ValidatorNetwork(networkName);
    const validatorPubKey = signingKey.toPublicKey().toHexString();
    yield database.validator.network.set(validatorPubKey, network);

    yield call(addNewValidatorSaga, addNewValidator(signingKey.toPublicKey().toHexString(), account));
}

export function* registerSagaWatcher(): Generator {
    yield all([
        takeEvery(afterCreatePassword, afterCreatePasswordProcess),
        takeEvery(afterConfirmPassword, afterConfirmPasswordProcess),
    ]);
}
