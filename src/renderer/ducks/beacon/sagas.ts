import {all, call, put, takeEvery, PutEffect, CallEffect} from "redux-saga/effects";
import {startLocalBeacon, removeBeacon, addBeacon, addBeacons} from "./actions";
import {endDockerImagePull, startDockerImagePull} from "../network/actions";
import {getNetworkConfig} from "../../services/eth2/networks";
import {BeaconChain} from "../../services/docker/chain";
import {SupportedNetworks} from "../../services/eth2/supportedNetworks";
import database from "../../services/db/api/database";
import {Beacons} from "../../models/beacons";
import {postInit} from "../store";

function* startLocalBeaconSaga({
    payload: {network, ports},
}: ReturnType<typeof startLocalBeacon>): Generator<PutEffect | CallEffect, void, BeaconChain> {
    // Pull image first
    yield put(startDockerImagePull());
    const image = getNetworkConfig(network).dockerConfig.image;
    yield call(BeaconChain.pullImage, image);
    yield put(endDockerImagePull());

    // Start chain
    switch (network) {
        default:
            yield put(
                addBeacon(
                    `http://localhost:${ports[1].local}`,
                    (yield call(BeaconChain.startBeaconChain, SupportedNetworks.LOCALHOST, ports)).getName(),
                ),
            );
    }
}

function* storeBeacon({payload: {url, localDockerId}}: ReturnType<typeof addBeacon>): Generator<Promise<void>> {
    yield database.beacons.upsert({url, localDockerId});
}

function* removeBeaconSaga({payload}: ReturnType<typeof removeBeacon>): Generator<Promise<[boolean, boolean]>> {
    yield database.beacons.remove(payload);
}

function* initializeBeaconsFromStore(): Generator<Promise<Beacons> | PutEffect | Promise<void>, void, Beacons> {
    const store = yield database.beacons.get();
    if (store !== null) {
        const {beacons} = store;

        // TODO: refactor
        yield BeaconChain.startAllLocalBeaconNodes2();
        // TODO => yield BeaconChain.startAllLocalBeaconNodes();

        yield put(addBeacons(beacons.map(({url, localDockerId}) => ({url, localDockerId, status: "init"}))));
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
