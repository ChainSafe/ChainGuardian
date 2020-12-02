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
import {BeaconStatus} from "./slice";

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
    payload: {network, folderPath, eth1Url, discoveryPort, libp2pPort, rpcPort},
    meta: {onComplete},
}: ReturnType<typeof startLocalBeacon>): Generator<CallEffect | PutEffect, void, BeaconChain> {
    const pullSuccess = yield call(pullDockerImage, network);

    const ports = [
        {local: String(libp2pPort), host: String(libp2pPort)},
        {local: String(rpcPort), host: String(rpcPort)},
    ];
    if (libp2pPort !== discoveryPort) {
        ports.push({local: String(discoveryPort), host: String(discoveryPort)});
    }

    if (pullSuccess) {
        switch (network) {
            default:
                yield put(
                    addBeacon(`http://localhost:${rpcPort}`, {
                        id: (yield call(BeaconChain.startBeaconChain, SupportedNetworks.LOCALHOST, {
                            ports,
                            // eslint-disable-next-line max-len
                            cmd: `lighthouse beacon_node --network ${network} --port ${libp2pPort} --discovery-port ${discoveryPort} --http --http-address 0.0.0.0 --http-port ${rpcPort} --eth1-endpoints ${eth1Url}`,
                            volume: `${folderPath}:/root/.lighthouse`,
                        })).getParams().name,
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

function* initializeBeaconsFromStore(): Generator<
    Promise<Beacons> | PutEffect | Promise<void> | Promise<Response[]>,
    void,
    // eslint-disable-next-line camelcase
    Beacons & ({is_syncing: boolean} | null)[]
> {
    const store = yield database.beacons.get();
    if (store !== null) {
        const {beacons}: Beacons = store;

        yield BeaconChain.startAllLocalBeaconNodes();

        // TODO: remove this temp solution!
        const stats = yield Promise.all(
            beacons.map(({url}) =>
                fetch(url + "/eth/v1/node/syncing")
                    .then((response) => response.json())
                    .catch(() => null),
            ),
        );

        yield put(
            addBeacons(
                beacons.map(({url, docker}, index) => ({
                    url,
                    docker,
                    status:
                        stats[index] !== null
                            ? stats[index]
                                ? BeaconStatus.syncing
                                : BeaconStatus.active
                            : BeaconStatus.offline,
                })),
            ),
        );
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
