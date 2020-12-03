import {all, takeEvery, put, call, select, PutEffect, CallEffect, SelectEffect, AllEffect} from "redux-saga/effects";
import {BeaconChain} from "../../services/docker/chain";
import {SecretKey} from "@chainsafe/bls";
import {fromHex} from "../../services/utils/bytes";
import {BeaconNode, BeaconNodes} from "../../models/beaconNode";
import database from "../../services/db/api/database";
import * as logger from "electron-log";
import {IEth2ChainHead} from "../../models/types/head";
import {
    saveBeaconNode,
    loadedValidatorBeaconNodes,
    removeBeaconNode,
    loadValidatorBeaconNodes,
    subscribeToBlockListening,
} from "./actions";
import {CGAccount} from "../../models/account";
import {getRegisterSigningKey} from "../register/selectors";
import {getValidatorBeaconNodes, getValidatorBlockSubscription} from "./selectors";
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
    payload: {subscribe, validator},
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
    yield all(
        validatorBeaconNodes.map(function* (validatorBN) {
            if (validatorBN.client) {
                try {
                    const chainHead: IEth2ChainHead = yield validatorBN.client.beacon.getChainHead();
                    const refreshFnWithContext = refreshBeaconNodeStatus.bind(null, validator);
                    yield call(refreshFnWithContext, chainHead);

                    if (subscribe) {
                        const existingTimeout = yield select((state) =>
                            getValidatorBlockSubscription(state, {validator}),
                        );
                        if (!existingTimeout) {
                            const timeoutId = validatorBN.client.onNewChainHead(refreshFnWithContext);
                            yield put(subscribeToBlockListening(timeoutId, validator));
                        }
                    }
                } catch (e) {
                    yield put(loadedValidatorBeaconNodes(validatorBeaconNodes, validator));
                    logger.warn("Error while fetching chainhead from beacon node... ", e.message);
                }
            }
        }),
    );
}

function* refreshBeaconNodeStatus(
    validator: string,
    chainHead: IEth2ChainHead,
): Generator<SelectEffect | PutEffect | AllEffect<Promise<BeaconNode>>, void, BeaconNode[]> {
    const validatorBeaconNodes = yield select((state) => getValidatorBeaconNodes(state, {validator}));
    const beaconNodes: BeaconNode[] = yield all(
        validatorBeaconNodes.map(async (validatorBN: BeaconNode) => {
            try {
                if (!validatorBN.client) {
                    throw new Error("No ETH2 API client");
                }
                return {
                    ...validatorBN,
                    isSyncing: (await validatorBN.client.node.getSyncingStatus()).syncDistance === BigInt(0),
                    currentSlot: String(chainHead.slot),
                };
            } catch (e) {
                logger.warn(`Error while trying to fetch beacon node status... ${e.message}`);
                return validatorBN;
            }
        }),
    );
    yield put(loadedValidatorBeaconNodes(beaconNodes, validator));
}

export function* networkSagaWatcher(): Generator {
    yield all([
        takeEvery(saveBeaconNode, saveBeaconNodeSaga),
        takeEvery(removeBeaconNode, removeBeaconNodeSaga),
        takeEvery(loadValidatorBeaconNodes, loadValidatorBeaconNodesSaga),
    ]);
}
