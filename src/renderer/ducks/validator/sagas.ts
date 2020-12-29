import {
    select,
    put,
    SelectEffect,
    PutEffect,
    all,
    takeEvery,
    delay,
    race,
    take,
    cancel,
    fork,
    RaceEffect,
    CancelEffect,
    TakeEffect,
    AllEffect,
    ForkEffect,
} from "redux-saga/effects";
import {CGAccount} from "../../models/account";
import {deleteKeystore} from "../../services/utils/account";
import {ValidatorLogger} from "../../services/eth2/client/logger";
import database, {cgDbController} from "../../services/db/api/database";
import {config as mainnetConfig} from "@chainsafe/lodestar-config/lib/presets/mainnet";
import {IValidator} from "./slice";
import {
    loadValidators,
    addValidator,
    removeValidator,
    startValidatorService,
    stopValidatorService,
    stopActiveValidatorService,
    startNewValidatorService,
    removeActiveValidator,
    addNewValidator,
    loadValidatorsAction,
    setValidatorBeaconNode,
    storeValidatorBeaconNodes,
    updateValidatorBalance,
} from "./actions";
import {ICGKeystore} from "../../services/keystore";
import {unsubscribeToBlockListening} from "../network/actions";
import {SlashingProtection, Validator} from "@chainsafe/lodestar-validator";
import * as logger from "electron-log";
import {getAuthAccount} from "../auth/selectors";
import {getValidator, getValidatorBeaconNodes} from "./selectors";
import {ValidatorBeaconNodes} from "../../models/validatorBeaconNodes";
import {CgEth2ApiClient} from "../../services/eth2/client/eth2ApiClient";
import {WinstonLogger} from "@chainsafe/lodestar-utils";
import {Beacon} from "../beacon/slice";
import {readBeaconChainNetwork} from "../../services/eth2/client";
import {INetworkConfig} from "../../services/interfaces";
import {getValidatorBalance} from "../../services/utils/validator";
import {CallEffect} from "@redux-saga/core/effects";

const MINUTE = 60 * 1000;

interface IValidatorServices {
    [validatorAddress: string]: Validator;
}

const validatorServices: IValidatorServices = {};

function* loadValidatorsSaga(): Generator<
    | SelectEffect
    | PutEffect
    | Promise<ICGKeystore[]>
    | Promise<ValidatorBeaconNodes[]>
    | Promise<IValidator[]>
    | AllEffect<ForkEffect>,
    void,
    ICGKeystore[] & (CGAccount | null) & ValidatorBeaconNodes[] & IValidator[]
> {
    const auth: CGAccount | null = yield select(getAuthAccount);
    if (auth) {
        const validators: ICGKeystore[] = yield auth.loadValidators();
        const validatorArray: IValidator[] = yield Promise.all(
            validators.map(async (keyStore, index) => {
                const beaconNodes = await database.validatorBeaconNodes.get(keyStore.getPublicKey());
                const network = auth.getValidatorNetwork(keyStore.getPublicKey());
                const balance = await getValidatorBalance(keyStore.getPublicKey(), network, beaconNodes?.nodes[0]);
                return {
                    name: keyStore.getName() ?? `Validator - ${index}`,
                    status: undefined,
                    publicKey: keyStore.getPublicKey(),
                    network,
                    balance,
                    keystore: keyStore,
                    isRunning: false,
                    beaconNodes: beaconNodes?.nodes || [],
                };
            }),
        );
        yield put(loadValidators(validatorArray));
        yield all(validatorArray.map(({publicKey, network}) => fork(validatorInfoUpdater, publicKey, network)));
    }
}

export function* addNewValidatorSaga(action: ReturnType<typeof addNewValidator>): Generator<PutEffect | ForkEffect> {
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
    yield fork(validatorInfoUpdater, validator.publicKey, validator.network);
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

function* validatorInfoUpdater(
    publicKey: string,
    network: string,
): Generator<
    SelectEffect | PutEffect | CancelEffect | RaceEffect<TakeEffect | CallEffect> | Promise<undefined | bigint>,
    void,
    IValidator & [ReturnType<typeof removeActiveValidator>] & (undefined | bigint)
> {
    mainLoop: while (true) {
        try {
            const [cancelAction] = yield race([take(removeActiveValidator), delay(MINUTE)]);
            if (cancelAction && cancelAction.payload === publicKey) {
                yield cancel();
            }

            const validator = yield select(getValidator, {publicKey});
            // fetch balance from first working beacon node
            for (const beacon of validator.beaconNodes) {
                try {
                    const balance = yield getValidatorBalance(publicKey, network, beacon);
                    if (balance) yield put(updateValidatorBalance(publicKey, balance));
                    continue mainLoop;
                } catch (e) {
                    console.error(`error fetching balance from ${beacon}:`, e.message);
                }
            }
        } catch (err) {
            console.error("update validator error:", err.message);
        }
    }
}

export function* validatorSagaWatcher(): Generator {
    yield all([
        takeEvery(loadValidatorsAction, loadValidatorsSaga),
        takeEvery(addNewValidator, addNewValidatorSaga),
        takeEvery(removeActiveValidator, removeValidatorSaga),
        takeEvery(startNewValidatorService, startService),
        takeEvery(stopActiveValidatorService, stopService),
        takeEvery(setValidatorBeaconNode, setValidatorBeacon),
    ]);
}
