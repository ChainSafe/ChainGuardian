import {
    select,
    put,
    SelectEffect,
    PutEffect,
    all,
    takeEvery,
    race,
    take,
    cancel,
    fork,
    RaceEffect,
    CancelEffect,
    TakeEffect,
    AllEffect,
    ForkEffect,
    CallEffect,
} from "redux-saga/effects";
import {CGAccount} from "../../models/account";
import {deleteKeystore} from "../../services/utils/account";
import {ValidatorLogger} from "../../services/eth2/client/logger";
import database, {cgDbController} from "../../services/db/api/database";
import {config as mainnetConfig} from "@chainsafe/lodestar-config/lib/presets/mainnet";
import {IValidator, IValidatorComplete} from "./slice";
import {
    addNewValidator,
    addValidator,
    loadValidators,
    loadValidatorsAction,
    removeActiveValidator,
    removeValidator,
    setValidatorBeaconNode,
    startNewValidatorService,
    startValidatorService,
    stopActiveValidatorService,
    stopValidatorService,
    storeValidatorBeaconNodes,
    slashingProtectionUpload,
    slashingProtectionSkip,
    slashingProtectionCancel,
    updateValidatorBalance,
    setValidatorStatus,
    getNewValidatorBalance,
} from "./actions";
import {ICGKeystore} from "../../services/keystore";
import {unsubscribeToBlockListening} from "../network/actions";
import {Validator} from "@chainsafe/lodestar-validator";
import {Genesis} from "@chainsafe/lodestar-types";
import {getAuthAccount} from "../auth/selectors";
import {getValidator, getValidatorsByBeaconNode, BeaconValidators} from "./selectors";
import {ValidatorBeaconNodes} from "../../models/validatorBeaconNodes";
import {CgEth2ApiClient} from "../../services/eth2/client/eth2ApiClient";
import {readBeaconChainNetwork} from "../../services/eth2/client";
import {INetworkConfig} from "../../services/interfaces";
import {getValidatorBalance} from "../../services/utils/validator";
import {getValidatorStatus} from "../../services/utils/getValidatorStatus";
import {CGSlashingProtection} from "../../services/eth2/client/slashingProtection";
import {readFileSync} from "fs";
import {ValidatorStatus} from "../../constants/validatorStatus";
import {getBeaconByKey} from "../beacon/selectors";
import {Beacon, BeaconStatus} from "../beacon/slice";
import {updateStatus} from "../beacon/actions";
import {cgLogger} from "../../../main/logger";

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
    | AllEffect<ForkEffect>
    | AllEffect<CallEffect>,
    void,
    ICGKeystore[] & (CGAccount | null) & ValidatorBeaconNodes[] & IValidator[]
> {
    const auth: CGAccount | null = yield select(getAuthAccount);
    if (auth) {
        const validators: ICGKeystore[] = yield auth.loadValidators();
        const validatorArray: IValidator[] = yield Promise.all(
            validators.map(async (keyStore, index) => {
                const beaconNodes = await database.validator.beaconNodes.get(keyStore.getPublicKey());
                const network = auth.getValidatorNetwork(keyStore.getPublicKey());
                const name = keyStore.getName() ?? `Validator - ${index}`;
                try {
                    const balance = await getValidatorBalance(keyStore.getPublicKey(), network, beaconNodes?.nodes[0]);
                    const status = await getValidatorStatus(keyStore.getPublicKey(), beaconNodes?.nodes[0]);
                    cgLogger.info("Loading validator", name, "pubkey", keyStore.getPublicKey(), "network", network);
                    return {
                        publicKey: keyStore.getPublicKey(),
                        name,
                        status,
                        network,
                        balance,
                        keystore: keyStore,
                        isRunning: false,
                        beaconNodes: beaconNodes?.nodes || [],
                    };
                } catch (e) {
                    cgLogger.error(
                        "Failed to load validator",
                        name,
                        "pubkey",
                        keyStore.getPublicKey(),
                        "network",
                        network,
                        "error",
                        e.message,
                    );
                }
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
    cgLogger.info("Adding validator", validator.name, "pubkey", validator.publicKey, "network", validator.network);

    yield put(addValidator(validator));
    yield fork(validatorInfoUpdater, validator.publicKey, validator.network);
}

function* removeValidatorSaga(
    action: ReturnType<typeof removeActiveValidator>,
): Generator<SelectEffect | PutEffect | AllEffect<Promise<void>>, void, CGAccount | null> {
    cgLogger.info("Removing validator", action.payload);
    yield put(unsubscribeToBlockListening(action.payload));

    const auth: CGAccount | null = yield select(getAuthAccount);
    deleteKeystore(auth.directory, action.payload);
    auth.removeValidator(action.meta);

    yield all([
        database.validator.balance.delete(action.payload),
        database.validator.beaconNodes.delete(action.payload),
    ]);
    yield put(removeValidator(action.payload));
}

function* startService(
    action: ReturnType<typeof startNewValidatorService>,
): Generator<
    | SelectEffect
    | PutEffect
    | Promise<void>
    | Promise<boolean>
    | Promise<INetworkConfig | null>
    | Promise<Genesis | null>
    | RaceEffect<TakeEffect>,
    void,
    IValidatorComplete &
        [ReturnType<typeof slashingProtectionUpload> | undefined, ReturnType<typeof slashingProtectionCancel>] &
        (INetworkConfig | null) &
        (Genesis | null) &
        boolean
> {
    try {
        const publicKey = action.payload.publicKey.toHex();
        const validator = yield select(getValidator, {publicKey});
        if (!validator.beaconNodes.length) {
            throw new Error("missing beacon node");
        }

        const config = (yield readBeaconChainNetwork(validator.beaconNodes[0]))?.eth2Config || mainnetConfig;

        // TODO: Use beacon chain proxy instead of first node
        const eth2API = new CgEth2ApiClient(config, validator.beaconNodes[0]);

        const slashingProtection = new CGSlashingProtection({
            config,
            controller: cgDbController,
        });

        if (
            validator.status === ValidatorStatus.ACTIVE &&
            (yield slashingProtection.missingImportedSlashingProtection(publicKey))
        ) {
            action.meta.openModal();
            const [upload, cancel] = yield race([
                take(slashingProtectionUpload),
                take(slashingProtectionCancel),
                take(slashingProtectionSkip),
            ]);
            action.meta.closeModal();

            if (cancel) {
                throw new Error("canceled by user");
            }
            if (upload) {
                const {genesisValidatorsRoot} = yield eth2API.beacon.getGenesis();
                const interchange = JSON.parse(
                    readFileSync(
                        ((upload as unknown) as ReturnType<typeof slashingProtectionUpload>).payload,
                    ).toString(),
                );
                yield slashingProtection.importInterchange(interchange, genesisValidatorsRoot);
            }
        }

        const logger = new ValidatorLogger(undefined, undefined, publicKey);

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
        cgLogger.info("Starting validator", publicKey);
        yield validatorServices[publicKey].start();

        yield put(startValidatorService(logger, publicKey));
    } catch (e) {
        cgLogger.error("Failed to start validator", e.message);
    }
}

function* stopService(action: ReturnType<typeof stopActiveValidatorService>): Generator<PutEffect | Promise<void>> {
    const publicKey = action.payload.publicKey.toHex();
    yield validatorServices[publicKey].stop();

    cgLogger.info("Stopping validator", action.payload.publicKey.toHex());

    yield put(stopValidatorService(publicKey));
}

function* setValidatorBeacon({
    payload,
    meta,
}: ReturnType<typeof setValidatorBeaconNode>): Generator<
    PutEffect | SelectEffect | Promise<ValidatorBeaconNodes> | Promise<ValidatorStatus>,
    void,
    ValidatorBeaconNodes & IValidator & ValidatorStatus
> {
    const beaconNodes = yield database.validator.beaconNodes.update(meta, payload);
    yield put(storeValidatorBeaconNodes(beaconNodes.nodes, meta));
    cgLogger.info("Set validator", meta, "beacon node/s", beaconNodes.nodes);
    const validator = yield select(getValidator, {publicKey: meta});
    if (validator.status === ValidatorStatus.NO_BEACON_NODE) {
        const beacon = validator.beaconNodes.length ? validator.beaconNodes[0] : beaconNodes.nodes[0];
        const status = yield getValidatorStatus(meta, beacon);
        yield put(setValidatorStatus(status, meta));
    }
}

function* validatorInfoUpdater(
    publicKey: string,
    network: string,
): Generator<
    | SelectEffect
    | PutEffect
    | CancelEffect
    | RaceEffect<TakeEffect>
    | Promise<undefined | bigint>
    | Promise<void>
    | Promise<ValidatorStatus>,
    void,
    IValidator &
        [ReturnType<typeof removeActiveValidator>, ReturnType<typeof getNewValidatorBalance>] &
        (undefined | bigint) &
        Beacon
> {
    while (true) {
        try {
            const [cancelAction, {payload}] = yield race([take(removeActiveValidator), take(getNewValidatorBalance)]);
            if (cancelAction && cancelAction.payload === publicKey) {
                yield cancel();
            }

            const validator = yield select(getValidator, {publicKey});
            if (validator.beaconNodes.includes(payload.beacon)) {
                const beacon = yield select(getBeaconByKey, {key: payload.beacon});
                if (beacon.status === BeaconStatus.active) {
                    const balance = yield getValidatorBalance(publicKey, network, payload.beacon, payload.slot);
                    if (balance) {
                        yield database.validator.balance.addRecords(publicKey, [
                            {balance, epoch: BigInt(payload.epoch)},
                        ]);
                        yield put(updateValidatorBalance(publicKey, balance));
                    }
                    const state = ((yield getValidatorStatus(publicKey, payload.beacon)) as unknown) as ValidatorStatus;
                    if (validator.status !== state) {
                        yield put(setValidatorStatus(state, publicKey));
                    }
                }
            }
        } catch (err) {
            cgLogger.error("update validator error:", err.message);
        }
    }
}

function* onBeaconNodeStatusChangeUpdateValidatorState(
    action: ReturnType<typeof updateStatus>,
): Generator<SelectEffect | PutEffect | Promise<ValidatorStatus>, void, BeaconValidators & ValidatorStatus> {
    const beaconNodeValidator = yield select(getValidatorsByBeaconNode);
    if (beaconNodeValidator[action.meta]) {
        if (action.payload === BeaconStatus.active) {
            for (const {publicKey} of beaconNodeValidator[action.meta]) {
                const state = yield getValidatorStatus(publicKey, action.meta);
                yield put(setValidatorStatus(state, publicKey));
            }
        } else {
            for (const {publicKey} of beaconNodeValidator[action.meta]) {
                yield put(
                    setValidatorStatus(
                        action.payload === BeaconStatus.syncing
                            ? ValidatorStatus.SYNCING_BEACON_NODE
                            : ValidatorStatus.BEACON_NODE_OFFLINE,
                        publicKey,
                    ),
                );
            }
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
        takeEvery(updateStatus, onBeaconNodeStatusChangeUpdateValidatorState),
    ]);
}
