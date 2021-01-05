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
    call,
    CallEffect,
    delay,
} from "redux-saga/effects";
import {CGAccount} from "../../models/account";
import {deleteKeystore} from "../../services/utils/account";
import {ValidatorLogger} from "../../services/eth2/client/logger";
import database, {cgDbController} from "../../services/db/api/database";
import {config as mainnetConfig} from "@chainsafe/lodestar-config/lib/presets/mainnet";
import {IValidator} from "./slice";
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
    setSyncingBalance,
} from "./actions";
import {ICGKeystore} from "../../services/keystore";
import {unsubscribeToBlockListening} from "../network/actions";
import {Validator} from "@chainsafe/lodestar-validator";
import {Genesis} from "@chainsafe/lodestar-types";
import * as logger from "electron-log";
import {getAuthAccount} from "../auth/selectors";
import {getValidator, getValidatorBeaconNodes} from "./selectors";
import {ValidatorBeaconNodes} from "../../models/validatorBeaconNodes";
import {CgEth2ApiClient} from "../../services/eth2/client/eth2ApiClient";
import {Beacon} from "../beacon/slice";
import {readBeaconChainNetwork} from "../../services/eth2/client";
import {INetworkConfig} from "../../services/interfaces";
import {getValidatorBalance} from "../../services/utils/validator";
import {getValidatorStatus} from "../../services/utils/getValidatorStatus";
import {CGSlashingProtection} from "../../services/eth2/client/slashingProtection";
import {readFileSync} from "fs";
import {finalizedEpoch} from "../beacon/actions";
import {fromHexString} from "@chainsafe/ssz";
import {getNetworkConfig} from "../../services/eth2/networks";

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
                const beaconNodes = await database.validatorBeaconNodes.get(keyStore.getPublicKey());
                const network = auth.getValidatorNetwork(keyStore.getPublicKey());
                const balance = await getValidatorBalance(keyStore.getPublicKey(), network, beaconNodes?.nodes[0]);
                return {
                    name: keyStore.getName() ?? `Validator - ${index}`,
                    status: await getValidatorStatus(keyStore.getPublicKey(), beaconNodes?.nodes[0]),
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
        yield all(validatorArray.map(({publicKey, network}) => call(syncValidatorBalances, publicKey, network)));
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
    | SelectEffect
    | PutEffect
    | Promise<void>
    | Promise<boolean>
    | Promise<INetworkConfig | null>
    | Promise<Genesis | null>
    | RaceEffect<TakeEffect>,
    void,
    Beacon[] & (INetworkConfig | null) & (Genesis | null) & boolean
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

        const slashingProtection = new CGSlashingProtection({
            config,
            controller: cgDbController,
        });

        // TODO: check if state is not before "active" to ignore this step in that case
        if (yield slashingProtection.missingImportedSlashingProtection(publicKey)) {
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

        const logger = new ValidatorLogger();

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
    SelectEffect | PutEffect | CancelEffect | RaceEffect<TakeEffect> | Promise<undefined | bigint> | Promise<void>,
    void,
    IValidator & [ReturnType<typeof removeActiveValidator>, ReturnType<typeof finalizedEpoch>] & (undefined | bigint)
> {
    while (true) {
        try {
            const [cancelAction, {payload}] = yield race([take(removeActiveValidator), take(finalizedEpoch)]);
            if (cancelAction && cancelAction.payload === publicKey) {
                yield cancel();
            }

            const validator = yield select(getValidator, {publicKey});
            if (validator.beaconNodes.includes(payload.beacon)) {
                const balance = yield getValidatorBalance(publicKey, network, payload.beacon);
                if (balance) {
                    yield database.validator.balance.addRecords(publicKey, [{balance, epoch: BigInt(payload.epoch)}]);
                    yield put(updateValidatorBalance(publicKey, balance));
                }
            }
        } catch (err) {
            logger.error("update validator error:", err.message);
        }
    }
}

function* syncValidatorBalances(publicKey: string, network: string): Generator<any, void, any> {
    yield delay(1000); // delay to all data can be loaded in time
    const beaconNodes = yield select(getValidatorBeaconNodes, {publicKey});
    if (!beaconNodes.length) {
        return;
    }
    yield put(setSyncingBalance(publicKey, true));

    const config = getNetworkConfig(network);
    const eth2Client = new CgEth2ApiClient(config.eth2Config, beaconNodes[0].url);
    const validatorId = fromHexString(publicKey);

    const headValidatorState = yield eth2Client.beacon.state.getStateValidator("head", validatorId);
    const {activationEpoch, exitEpoch} = headValidatorState.validator;

    const lastEpoch = yield eth2Client.beacon.state.getLastEpoch();
    const balances = yield database.validator.balance.get(publicKey);
    const firstRecord = yield balances.getFirstEpoch();
    const lastRecord = yield balances.getLastEpoch();

    if (lastEpoch >= exitEpoch) {
        return;
    }

    const from = activationEpoch !== firstRecord ? BigInt(activationEpoch) : lastRecord;
    const to = isFinite(exitEpoch) ? BigInt(exitEpoch) : lastEpoch;
    const missing = yield balances.getMissingEpochs(from, to);
    missing.reverse();

    const chunkSize = 10; // its take around 1min to get chunk of 10 records
    const chunks: bigint[][] = [];
    for (let i = 0, j = missing.length; i < j; i += chunkSize) {
        chunks.push(missing.slice(i, i + chunkSize));
    }

    for (const chunk of chunks) {
        const records: any[] = yield all(
            chunk.map((epoch: bigint) =>
                call(eth2Client.beacon.state.getStateValidator, BigInt(Number(epoch) * 32), validatorId),
            ),
        );
        const balances = records.map(({balance}, index) => ({balance, epoch: chunk[index]}));
        yield database.validator.balance.addRecords(publicKey, balances);
    }
    yield put(setSyncingBalance(publicKey, false));
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
