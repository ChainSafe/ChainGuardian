import {
    all,
    call,
    put,
    fork,
    takeEvery,
    PutEffect,
    CallEffect,
    RaceEffect,
    TakeEffect,
    race,
    take,
    cancel,
    retry,
    select,
    SelectEffect,
} from "redux-saga/effects";
import {getNetworkConfig} from "../../services/eth2/networks";
import {liveProcesses} from "../../services/utils/cmd";
import {cancelDockerPull, endDockerImagePull, startDockerImagePull} from "../network/actions";
import {
    startLocalBeacon,
    removeBeacon,
    addBeacon,
    addBeacons,
    updateSlot,
    finalizedEpoch,
    updateStatus,
} from "./actions";
import {BeaconChain} from "../../services/docker/chain";
import {SupportedNetworks} from "../../services/eth2/supportedNetworks";
import database from "../../services/db/api/database";
import {Beacons} from "../../models/beacons";
import {postInit} from "../store";
import {Beacon, BeaconStatus} from "./slice";
import {Action} from "redux";
import {CgEth2ApiClient} from "../../services/eth2/client/eth2ApiClient";
import {mainnetConfig} from "@chainsafe/lodestar-config/lib/presets/mainnet";
import {BeaconEventType, HeadEvent} from "@chainsafe/lodestar-validator/lib/api/interface/events";
import {AllEffect, CancelEffect, ForkEffect} from "@redux-saga/core/effects";
import {readBeaconChainNetwork} from "../../services/eth2/client";
import {INetworkConfig} from "../../services/interfaces";
import {CGBeaconEvent, CGBeaconEventType, FinalizedCheckpointEvent} from "../../services/eth2/client/interface";
import logger from "electron-log";
import {getBeaconByKey} from "./selectors";
import {SyncingStatus} from "@chainsafe/lodestar-types";
import {BeaconValidators, getValidatorsByBeaconNode} from "../validator/selectors";
import {storeValidatorBeaconNodes} from "../validator/actions";
import {ValidatorBeaconNodes} from "../../models/validatorBeaconNodes";

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
    payload: {network, chainDataDir, eth1Url, discoveryPort, libp2pPort, rpcPort},
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
                            volume: `${chainDataDir}:/root/.lighthouse`,
                        })).getParams().name,
                        network,
                        chainDataDir,
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

function* storeBeacon({payload: {url, docker}}: ReturnType<typeof addBeacon>): Generator<Promise<void> | ForkEffect> {
    if (!docker)
        // eslint-disable-next-line no-param-reassign
        docker = {id: "", network: "", chainDataDir: "", eth1Url: "", discoveryPort: "", libp2pPort: "", rpcPort: ""};
    yield database.beacons.upsert({url, docker});
    yield fork(watchOnHead, url);
}

function* removeBeaconSaga({
    payload,
}: ReturnType<typeof removeBeacon>): Generator<
    SelectEffect | PutEffect | Promise<[boolean, boolean]> | Promise<ValidatorBeaconNodes>,
    void,
    [boolean, boolean] & BeaconValidators & ValidatorBeaconNodes
> {
    const [removed] = yield database.beacons.remove(payload);
    if (removed) {
        const beaconValidators = yield select(getValidatorsByBeaconNode);
        for (const {publicKey} of beaconValidators[payload]) {
            const {nodes} = yield database.validatorBeaconNodes.remove(publicKey, payload);
            console.log(nodes, payload);
            yield put(storeValidatorBeaconNodes(nodes, publicKey));
        }
    }
}

function* initializeBeaconsFromStore(): Generator<
    | Promise<Beacons>
    | PutEffect
    | Promise<void>
    | Promise<({syncing: boolean; slot: number} | null)[]>
    | AllEffect<ForkEffect>,
    void,
    Beacons & ({syncing: boolean; slot: number} | null)[]
> {
    const store = yield database.beacons.get();
    if (store !== null) {
        const {beacons}: Beacons = store;

        yield BeaconChain.startAllLocalBeaconNodes();

        const stats = yield Promise.all(
            beacons.map(async ({url}) => {
                const client = new CgEth2ApiClient(mainnetConfig, url);
                const result = await client.node.getSyncingStatus();
                return {slot: Number(result.headSlot), syncing: result.syncDistance > 10};
            }),
        );

        yield all(beacons.map(({url}) => fork(watchOnHead, url)));

        yield put(
            addBeacons(
                beacons.map(({url, docker}, index) => ({
                    url,
                    docker: docker.id !== "" ? docker : undefined,
                    slot: stats[index]?.slot || 0,
                    status:
                        stats[index].syncing !== null
                            ? stats[index].syncing
                                ? BeaconStatus.syncing
                                : BeaconStatus.active
                            : BeaconStatus.offline,
                })),
            ),
        );
    }
}

export function* watchOnHead(
    url: string,
): Generator<
    | PutEffect
    | CancelEffect
    | RaceEffect<Promise<IteratorResult<CGBeaconEvent>> | TakeEffect>
    | CallEffect
    | SelectEffect
    | Promise<SyncingStatus>,
    void,
    [IteratorResult<HeadEvent | FinalizedCheckpointEvent>, ReturnType<typeof removeBeacon>] &
        (INetworkConfig | null) &
        Beacon &
        SyncingStatus
> {
    const config = yield retry(30, 1000, readBeaconChainNetwork, url);
    const client = new CgEth2ApiClient(config?.eth2Config || mainnetConfig, url);
    const eventStream = client.events.getEventStream([
        BeaconEventType.HEAD,
        // TODO: refactor when they update Types "BeaconEventType"
        (CGBeaconEventType.FINALIZED_CHECKPOINT as unknown) as BeaconEventType,
    ]);

    const beacon = yield select(getBeaconByKey, {key: url});
    let isSyncing = beacon.status === BeaconStatus.syncing;

    while (true) {
        try {
            const [payload, cancelAction] = yield race([
                eventStream[Symbol.asyncIterator]().next(),
                take(removeBeacon),
            ]);
            if (cancelAction || payload.done) {
                if (cancelAction.payload === url) {
                    eventStream.stop();
                    yield cancel();
                }
                continue;
            }
            if (payload.value.type === BeaconEventType.HEAD) {
                yield put(updateSlot(payload.value.message.slot, url));
                if (isSyncing) {
                    const result = yield client.node.getSyncingStatus();
                    isSyncing = result.syncDistance > 10;
                    yield put(updateStatus(BeaconStatus.active, url));
                }
            }
            if (payload.value.type === CGBeaconEventType.FINALIZED_CHECKPOINT)
                yield put(finalizedEpoch(url, payload.value.message.epoch));
        } catch (err) {
            logger.error("Event error:", err.message);
        }
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
