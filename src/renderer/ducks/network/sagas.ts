import {all, takeEvery, put, call, select, PutEffect, CallEffect, SelectEffect, AllEffect} from "redux-saga/effects";
import {BeaconChain} from "../../services/docker/chain";
import {SecretKey} from "@chainsafe/bls";
import {fromHex} from "../../services/utils/bytes";
import {BeaconNode, BeaconNodes} from "../../models/beaconNode";
import database from "../../services/db/api/database";
import * as logger from "electron-log";
import {IEth2ChainHead} from "../../models/types/head";
import {saveBeaconNode, loadedValidatorBeaconNodes, removeBeaconNode, loadValidatorBeaconNodes} from "./actions";
import {CGAccount} from "../../models/account";
import {getRegisterSigningKey} from "../register/selectors";
import {getAuthAccount} from "../auth/selectors";

function* saveBeaconNodeSaga({
    payload: {url, network, validatorKey},
}: ReturnType<typeof saveBeaconNode>): Generator<SelectEffect | Promise<void>, void, string> {
    const localDockerName = network ? BeaconChain.getContainerName(network) : null;
    let validatorAddress = validatorKey || "";
    // TODO: add logic to decode key in case of crating node
    if (validatorAddress === "") {
        const signingKeyState: string = yield select(getRegisterSigningKey);
        const signingKey = SecretKey.fromBytes(fromHex(signingKeyState));
        validatorAddress = signingKey.toPublicKey().toHex();
    }
    const beaconNode = new BeaconNodes();
    beaconNode.addNode(url, localDockerName);
    yield database.beaconNodes.upsert(validatorAddress, beaconNode);
}

function* removeBeaconNodeSaga({
    payload: {image, validator},
}: ReturnType<typeof removeBeaconNode>): Generator<
    Promise<void> | Promise<BeaconNodes> | PutEffect,
    void,
    BeaconNodes
> {
    const validatorBeaconNodes = yield database.beaconNodes.get(validator);
    const newBeaconNodesList = BeaconNodes.createNodes(validatorBeaconNodes.nodes);
    newBeaconNodesList.removeNode(image);
    yield database.beaconNodes.set(validator, newBeaconNodesList);

    yield put(loadedValidatorBeaconNodes(newBeaconNodesList.nodes, validator));
}

export function* loadValidatorBeaconNodesSaga({
    payload: {validator},
}: ReturnType<typeof loadValidatorBeaconNodes>): Generator<
    | SelectEffect
    | CallEffect
    | AllEffect<
          // TODO: find current type
          Generator<any | SelectEffect | PutEffect, void, IEth2ChainHead>
      >,
    void,
    CGAccount & BeaconNode[]
> {
    const account = yield select(getAuthAccount);
    if (!account) {
        return;
    }
    const validatorBeaconNodes: BeaconNode[] = yield call(account.getValidatorBeaconNodes, validator);
    logger.info(`Found ${validatorBeaconNodes.length} beacon nodes for validator ${validator}.`);
}

export function* networkSagaWatcher(): Generator {
    yield all([
        takeEvery(saveBeaconNode, saveBeaconNodeSaga),
        takeEvery(removeBeaconNode, removeBeaconNodeSaga),
        takeEvery(loadValidatorBeaconNodes, loadValidatorBeaconNodesSaga),
    ]);
}
