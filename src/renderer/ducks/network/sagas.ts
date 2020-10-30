import {all, takeEvery, put, call, select, PutEffect, CallEffect, SelectEffect, AllEffect} from "redux-saga/effects";
import {Dispatch} from "redux";
import {IRootState} from "../../reducers";
import {getNetworkConfig} from "../../services/eth2/networks";
import {BeaconChain} from "../../services/docker/chain";
import {SupportedNetworks} from "../../services/eth2/supportedNetworks";
import {PrivateKey} from "@chainsafe/bls";
import {fromHex} from "../../services/utils/bytes";
import {BeaconNode, BeaconNodes} from "../../models/beaconNode";
import database from "../../services/db/api/database";
import * as logger from "electron-log";
import {IEth2ChainHead} from "../../models/types/head";
import {
    startDockerImagePull,
    endDockerImagePull,
    startBeaconChain,
    saveBeaconNode,
    loadedValidatorBeaconNodes,
    removeBeaconNode, loadValidatorBeaconNodes, subscribeToBlockListening
} from "./actions";
import {CGAccount} from "../../models/account";

function* startBeaconChainSaga({payload: {network, ports}}: ReturnType<typeof startBeaconChain>):
Generator<PutEffect | CallEffect, void> {
    // Pull image first
    yield put(startDockerImagePull());
    const image = getNetworkConfig(network).dockerConfig.image;
    yield call(BeaconChain.pullImage, image);
    yield put(endDockerImagePull());

    // Start chain
    switch(network) {
        default:
            yield call(BeaconChain.startBeaconChain, SupportedNetworks.LOCALHOST, ports);
    }

    // Save local beacon node to db
    yield call(saveBeaconNodeSaga, saveBeaconNode(`http://localhost:${ports[1].local}`, network));
}

function* saveBeaconNodeSaga({payload: {url, network, validatorKey}}: ReturnType<typeof saveBeaconNode>):
Generator<SelectEffect | CallEffect, void, string> {
    const localDockerName = network ? BeaconChain.getContainerName(network) : null;
    let validatorAddress = validatorKey || "";
    if (validatorAddress === "") {
        // TODO: use sector
        const signingKeyState: string = yield select(s => s.register.signingKey);
        const signingKey = PrivateKey.fromBytes(fromHex(signingKeyState));
        validatorAddress = signingKey.toPublicKey().toHexString();
    }
    const beaconNode = new BeaconNodes();
    beaconNode.addNode(url, localDockerName);
    yield call(database.beaconNodes.upsert, validatorAddress, beaconNode);
}

function* removeBeaconNodeSaga({payload: {image, validator}}: ReturnType<typeof removeBeaconNode>):
Generator<CallEffect | PutEffect, void, BeaconNodes> {
    const validatorBeaconNodes = yield call(database.beaconNodes.get, validator);
    const newBeaconNodesList = BeaconNodes.createNodes(validatorBeaconNodes.nodes);
    newBeaconNodesList.removeNode(image);
    yield call(database.beaconNodes.set, validator, newBeaconNodesList);

    yield put(loadedValidatorBeaconNodes(newBeaconNodesList.nodes, validator));
}

function* loadValidatorBeaconNodesSaga({payload: {subscribe, validator}}: ReturnType<typeof loadValidatorBeaconNodes>):
Generator<
SelectEffect | CallEffect | AllEffect<
Generator<CallEffect | SelectEffect | PutEffect,
void,
IEth2ChainHead>>,
void,
CGAccount & BeaconNode[]
> {
    const account = yield select(s => s.auth.account);
    if (!account) {
        return;
    }
    const validatorBeaconNodes: BeaconNode[] = yield call(account.getValidatorBeaconNodes, validator);
    logger.info(`Found ${validatorBeaconNodes.length} beacon nodes for validator ${validator}.`);
    yield all(
        validatorBeaconNodes.map(function* (validatorBN) {
            if (validatorBN.client) {
                try {
                    const chainHead: IEth2ChainHead = yield call(validatorBN.client.beacon.getChainHead);
                    // TODO: uff, test if this naive attempt will work
                    const refreshFnWithContext = refreshBeaconNodeStatus.bind(null, validator);
                    yield call(refreshFnWithContext, chainHead);

                    if (subscribe) {
                        // TODO: use sector
                        const existingTimeout = yield select(s => s.network.blockSubscriptions[validator]);
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
        })
    );
}

function* refreshBeaconNodeStatus(validator: string, chainHead: IEth2ChainHead):
Generator<SelectEffect | PutEffect | AllEffect<Promise<BeaconNode>>, void, BeaconNode[]> {
    const validatorBeaconNodes = yield select(s => s.auth.account!.getValidatorBeaconNodes(validator));
    const beaconNodes: BeaconNode[] = yield all(validatorBeaconNodes.map(async(validatorBN: BeaconNode) => {
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
    }));
    yield put(loadedValidatorBeaconNodes(beaconNodes, validator));
}

export function* networkSagaWatcher(): Generator {
    yield all([
        takeEvery(startBeaconChain, startBeaconChainSaga),
        takeEvery(saveBeaconNode, saveBeaconNodeSaga),
        takeEvery(removeBeaconNode, removeBeaconNodeSaga),
        takeEvery(loadValidatorBeaconNodes, loadValidatorBeaconNodesSaga),
    ]);
}
