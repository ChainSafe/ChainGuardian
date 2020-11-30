import {Action} from "redux";
import {all, call, put, takeEvery, PutEffect, CallEffect, RaceEffect, TakeEffect, race, take} from "redux-saga/effects";
import {getNetworkConfig} from "../../services/eth2/networks";
import {liveProcesses} from "../../services/utils/cmd";
import {cancelDockerPull, endDockerImagePull, startDockerImagePull} from "../network/actions";
import {startLocalBeacon, removeBeacon, addBeacon, addBeacons} from "./actions";
import {BeaconChain} from "../../services/docker/chain";
import {SupportedNetworks} from "../../services/eth2/supportedNetworks";
import database from "../../services/db/api/database";
import {Beacons} from "../../models/beacons";
import {postInit} from "../store";

export function* pullDockerImage(
    network: string,
): Generator<PutEffect | RaceEffect<CallEffect | TakeEffect>, boolean, [boolean, Action]> {
    yield put(startDockerImagePull());
    const image = getNetworkConfig(network).dockerConfig.image;
    const [pullSuccess, effect] = yield race([call(BeaconChain.pullImage, image), take(cancelDockerPull)]);
    if (effect) {
        liveProcesses["pullImage"].kill();
    }
    yield put(endDockerImagePull());

    return effect !== undefined ? false : pullSuccess;
}

function* startLocalBeaconSaga({
    payload: {network, ports, folderPath, eth1Url, discoveryPort, libp2pPort, rpcPort},
    meta: {onComplete},
}: ReturnType<typeof startLocalBeacon>): Generator<CallEffect | PutEffect, void, BeaconChain> {
    const pullSuccess = yield call(pullDockerImage, network);
    if (pullSuccess) {
        switch (network) {
            default:
                yield put(
                    addBeacon(`http://localhost:${ports[1].local}`, {
                        id: (yield call(BeaconChain.startBeaconChain, SupportedNetworks.LOCALHOST, ports)).getName(),
                        network,
                        folderPath,
                        eth1Url,
                        discoveryPort,
                        libp2pPort,
                        rpcPort,
                    }),
                );
        }
        onComplete();
    }
}

function* storeBeacon({payload: {url, docker}}: ReturnType<typeof addBeacon>): Generator<Promise<void>> {
    yield database.beacons.upsert({url, docker});
}

function* removeBeaconSaga({payload}: ReturnType<typeof removeBeacon>): Generator<Promise<[boolean, boolean]>> {
    yield database.beacons.remove(payload);
}

function* initializeBeaconsFromStore(): Generator<Promise<Beacons> | PutEffect | Promise<void>, void, Beacons> {
    const store = yield database.beacons.get();
    if (store !== null) {
        const {beacons} = store;

        yield BeaconChain.startAllLocalBeaconNodes();

        yield put(addBeacons(beacons.map(({url, docker}) => ({url, docker, status: "init"}))));
    }
}

export function* beaconSagaWatcher(): Generator {
    yield all([
        takeEvery(startLocalBeacon, startLocalBeaconSaga),
        takeEvery(addBeacon, storeBeacon),
        takeEvery(removeBeacon, removeBeaconSaga),
        takeEvery(postInit, initializeBeaconsFromStore),
    ]);
}
