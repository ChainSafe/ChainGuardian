import {PrivateKey} from "@chainsafe/bls";
import {ValidatorNetwork} from "../../models/network";
import database from "../../services/db/api/database";
import {fromHex} from "../../services/utils/bytes";
import {wordlists} from "bip39";
import {saveKeystore} from "../../services/utils/account";
import {randBetween} from "@chainsafe/lodestar-utils";
import {CGAccount} from "../../models/account";
import {DEFAULT_ACCOUNT} from "../../constants/account";
import {all, takeEvery, select, call, SelectEffect, CallEffect} from "redux-saga/effects";
import {afterPassword} from "./actions";
import {addNewValidator} from "../validator/actions";
import {addNewValidatorSaga} from "../validator/sagas";
import {getRegisterNetwork, getRegisterSigningKey, getRegisterSigningKeyPath} from "./selectors";

function* afterPasswordProcess({payload: {password, name}}: ReturnType<typeof afterPassword>):
Generator<SelectEffect | CallEffect | Promise<void>, void, string> {
    const signingKeyData = yield select(getRegisterSigningKey);
    const signingKey = PrivateKey.fromBytes(fromHex(signingKeyData));
    // 1. Save to keystore
    const englishWordList = wordlists["english"];
    const keyPath = yield select(getRegisterSigningKeyPath);
    const accountDirectory = yield call(
        saveKeystore,
        signingKey,
        password,
        keyPath,
        name ?? "Validator " + englishWordList[randBetween(0, englishWordList.length - 1)]
    );

    // 2. Save account to db
    const account = new CGAccount({
        name: "Default",
        directory: accountDirectory,
        sendStats: false
    });

    yield database.account.set(DEFAULT_ACCOUNT, account);

    // 3. Save network
    const networkName = yield select(getRegisterNetwork);
    const network = new ValidatorNetwork(networkName);
    const validatorPubKey = signingKey.toPublicKey().toHexString();
    yield database.validator.network.set(validatorPubKey, network);

    yield call(addNewValidatorSaga, addNewValidator(signingKey.toPublicKey().toHexString(), account));
}

export function* registerSagaWatcher(): Generator {
    yield all([
        takeEvery(afterPassword, afterPasswordProcess),
    ]);
}