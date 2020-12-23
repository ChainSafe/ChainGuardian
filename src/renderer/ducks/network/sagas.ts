import {all, takeEvery, put, select, PutEffect, SelectEffect} from "redux-saga/effects";
import {BeaconChain} from "../../services/docker/chain";
import {SecretKey} from "@chainsafe/bls";
import {fromHex} from "../../services/utils/bytes";
import {BeaconNodes} from "../../models/beaconNode";
import database from "../../services/db/api/database";
import {saveBeaconNode, loadedValidatorBeaconNodes, removeBeaconNode} from "./actions";
import {getRegisterSigningKey} from "../register/selectors";

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

export function* networkSagaWatcher(): Generator {
    yield all([takeEvery(saveBeaconNode, saveBeaconNodeSaga), takeEvery(removeBeaconNode, removeBeaconNodeSaga)]);
}
