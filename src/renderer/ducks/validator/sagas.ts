import {select, put, SelectEffect, PutEffect, call, CallEffect, all, takeEvery} from "redux-saga/effects";
import {CGAccount} from "../../models/account";
import {deleteKeystore} from "../../services/utils/account";
import {fromHex} from "../../services/utils/bytes";
import {getNetworkConfig} from "../../services/eth2/networks";
import {EthersNotifier} from "../../services/deposit/ethers";
import {getValidatorStatus, ValidatorStatus} from "../../services/validator/status";
import {ValidatorLogger} from "../../services/eth2/client/logger";
import database, {cgDbController} from "../../services/db/api/database";
import {config as mainnetConfig} from "@chainsafe/lodestar-config/lib/presets/mainnet";
import {IByPublicKey, IValidator} from "./slice";
import {
    loadValidators,
    addValidator,
    removeValidator,
    startValidatorService,
    stopValidatorService,
    loadValidatorStatus,
    loadedValidatorsBalance,
    stopActiveValidatorService,
    startNewValidatorService,
    updateValidatorsFromChain,
    updateValidatorChainData,
    removeActiveValidator,
    addNewValidator,
    updateValidatorStatus,
    loadValidatorsAction,
    setValidatorBeaconNode,
    storeValidatorBeaconNodes,
} from "./actions";
import {ICGKeystore} from "../../services/keystore";
import {loadValidatorBeaconNodes, unsubscribeToBlockListening} from "../network/actions";
import {SlashingProtection, Validator} from "@chainsafe/lodestar-validator";
import {IValidatorBeaconNodes} from "../../models/beaconNode";
import {loadValidatorBeaconNodesSaga} from "../network/sagas";
import {AllEffect} from "@redux-saga/core/effects";
import {ValidatorResponse} from "@chainsafe/lodestar-types";
import * as logger from "electron-log";
import {getAuthAccount} from "../auth/selectors";
import {getBeaconNodes} from "../network/selectors";
import {getValidatorBeaconNodes, getValidators} from "./selectors";
import {ValidatorBeaconNodes} from "../../models/validatorBeaconNodes";
import {CgEth2ApiClient} from "../../services/eth2/client/eth2ApiClient";
import {WinstonLogger} from "@chainsafe/lodestar-utils";
import {Beacon} from "../beacon/slice";
import {readBeaconChainNetwork} from "../../services/eth2/client";
import {INetworkConfig} from "../../services/interfaces";

interface IValidatorServices {
    [validatorAddress: string]: Validator;
}

const validatorServices: IValidatorServices = {};

function* loadValidatorsSaga(): Generator<
    SelectEffect | PutEffect | Promise<ICGKeystore[]> | Promise<ValidatorBeaconNodes[]> | Promise<IValidator[]>,
    void,
    ICGKeystore[] & (CGAccount | null) & ValidatorBeaconNodes[] & IValidator[]
> {
    const auth: CGAccount | null = yield select(getAuthAccount);
    if (auth) {
        const validators: ICGKeystore[] = yield auth.loadValidators();
        const validatorArray: IValidator[] = yield Promise.all(
            validators.map(async (keyStore, index) => {
                const beaconNodes = await database.validatorBeaconNodes.get(keyStore.getPublicKey());
                return {
                    name: keyStore.getName() ?? `Validator - ${index}`,
                    status: undefined,
                    publicKey: keyStore.getPublicKey(),
                    network: auth.getValidatorNetwork(keyStore.getPublicKey()),
                    keystore: keyStore,
                    isRunning: undefined,
                    beaconNodes: beaconNodes?.nodes || [],
                };
            }),
        );
        yield put(loadValidators(validatorArray));
    }
}

export function* addNewValidatorSaga(action: ReturnType<typeof addNewValidator>): Generator<PutEffect> {
    const keystore = action.meta.loadKeystore(action.payload.publicKey);
    const validator: IValidator = {
        name: action.payload.name || `Validator ${action.meta.getValidators().length + 2}`,
        publicKey: action.payload.publicKey,
        network: action.meta!.getValidatorNetwork(action.payload.publicKey),
        keystore,
        status: undefined,
        isRunning: false,
        beaconNodes: [],
    };

    yield put(addValidator(validator));
}

function* removeValidatorSaga(
    action: ReturnType<typeof removeActiveValidator>,
): Generator<SelectEffect | PutEffect, void, CGAccount | null> {
    const auth: CGAccount | null = yield select(getAuthAccount);
    deleteKeystore(auth.directory, action.payload);
    auth.removeValidator(action.meta);

    yield put(unsubscribeToBlockListening(action.payload));
    yield put(removeValidator(action.payload));
}

function* loadValidatorChainData(
    action: ReturnType<typeof updateValidatorChainData>,
): Generator<CallEffect | AllEffect<CallEffect>> {
    // Initialize validator object with API client
    yield call(loadValidatorBeaconNodesSaga, loadValidatorBeaconNodes(action.payload, true));
    // Load validator state from chain for i.e. balance
    // TODO: load all validators in one request per network
    yield all([
        call(loadValidatorsFromChain, updateValidatorsFromChain([action.payload])),
        call(loadValidatorStatusSaga, updateValidatorStatus(action.payload)),
    ]);
}

function* loadValidatorsFromChain(
    action: ReturnType<typeof updateValidatorsFromChain>,
): Generator<
    SelectEffect | Promise<ValidatorResponse[]> | PutEffect,
    void,
    IValidatorBeaconNodes & ValidatorResponse[]
> {
    const validatorBeaconNodes: IValidatorBeaconNodes = yield select(getBeaconNodes);
    const beaconNodes = validatorBeaconNodes[action.payload[0]];
    if (beaconNodes && beaconNodes.length > 0) {
        // TODO: Use any working beacon node instead of first one
        const client = beaconNodes[0].client;
        try {
            const response = yield client.beacon.state.getValidators("head", action.payload);
            yield put(loadedValidatorsBalance(response));
        } catch (e) {
            logger.warn("Error while fetching validator balance...", e.message);
        }
    }
}

function* loadValidatorStatusSaga(
    action: ReturnType<typeof updateValidatorStatus>,
): Generator<SelectEffect | CallEffect | PutEffect, void, ValidatorStatus & IValidatorBeaconNodes & IByPublicKey> {
    const validatorBeaconNodes: IValidatorBeaconNodes = yield select(getBeaconNodes);
    const beaconNodes = validatorBeaconNodes[action.payload];
    if (beaconNodes && beaconNodes.length > 0) {
        // TODO: Use any working beacon node instead of first one
        const eth2 = beaconNodes[0].client;
        const byPublicKey: IByPublicKey = yield select(getValidators);
        const network = byPublicKey[action.payload].network;
        const networkConfig = getNetworkConfig(network);
        const eth1 = new EthersNotifier(networkConfig, networkConfig.eth1Provider);
        const status: ValidatorStatus = yield call(getValidatorStatus, fromHex(action.payload), eth2, eth1);

        yield put(loadValidatorStatus(status, action.payload));
    }
}

function* startService(
    action: ReturnType<typeof startNewValidatorService>,
): Generator<
    SelectEffect | PutEffect | Promise<void> | Promise<INetworkConfig | null>,
    void,
    Beacon[] & (INetworkConfig | null)
> {
    try {
        const publicKey = action.payload.publicKey.toHex();
        const beaconNodes = yield select(getValidatorBeaconNodes, {publicKey});
        if (!beaconNodes.length) {
            throw new Error("missing beacon node");
        }

        const config = (yield readBeaconChainNetwork(beaconNodes[0].url))?.eth2Config || mainnetConfig;

        // TODO: Use beacon chain proxy instead of first node
        const eth2API = new CgEth2ApiClient(config, beaconNodes[0].url);

        const slashingProtection = new SlashingProtection({
            config,
            controller: cgDbController,
        });

        const logger = new WinstonLogger() as ValidatorLogger;

        if (!validatorServices[publicKey]) {
            validatorServices[publicKey] = new Validator({
                slashingProtection,
                api: eth2API,
                config,
                secretKeys: [action.payload.privateKey],
                logger,
                graffiti: "ChainGuardian",
            });
        }
        yield validatorServices[publicKey].start();

        yield put(startValidatorService(logger, publicKey));
    } catch (e) {
        logger.error("Failed to start validator", e.message);
    }
}

function* stopService(action: ReturnType<typeof stopActiveValidatorService>): Generator<PutEffect | Promise<void>> {
    const publicKey = action.payload.publicKey.toHex();
    yield validatorServices[publicKey].stop();

    yield put(stopValidatorService(publicKey));
}

function* setValidatorBeacon({
    payload,
    meta,
}: ReturnType<typeof setValidatorBeaconNode>): Generator<
    PutEffect | Promise<ValidatorBeaconNodes>,
    void,
    ValidatorBeaconNodes
> {
    const beaconNodes = yield database.validatorBeaconNodes.upsert(meta, [payload]);
    yield put(storeValidatorBeaconNodes(beaconNodes.nodes, meta));
}

export function* validatorSagaWatcher(): Generator {
    yield all([
        takeEvery(loadValidatorsAction, loadValidatorsSaga),
        takeEvery(addNewValidator, addNewValidatorSaga),
        takeEvery(removeActiveValidator, removeValidatorSaga),
        takeEvery(updateValidatorChainData, loadValidatorChainData),
        takeEvery(updateValidatorsFromChain, loadValidatorsFromChain),
        takeEvery(updateValidatorStatus, loadValidatorStatusSaga),
        takeEvery(startNewValidatorService, startService),
        takeEvery(stopActiveValidatorService, stopService),
        takeEvery(setValidatorBeaconNode, setValidatorBeacon),
    ]);
}
