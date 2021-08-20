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
    spawn,
    RaceEffect,
    CancelEffect,
    TakeEffect,
    AllEffect,
    ForkEffect,
    CallEffect,
    call,
    takeLatest,
} from "redux-saga/effects";
import {CGAccount} from "../../models/account";
import {deleteKeystore, saveValidatorData} from "../../services/utils/account";
import database, {cgDbController} from "../../services/db/api/database";
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
    signedNewAttestation,
    exportValidator,
    setValidatorIsRunning,
    startValidatorDutiesWatcher,
    publishNewBlock,
} from "./actions";
import {ICGKeystore} from "../../services/keystore";
import {unsubscribeToBlockListening} from "../network/actions";
import {Validator} from "@chainsafe/lodestar-validator";
import {getAuthAccount} from "../auth/selectors";
import {getValidator, getValidatorsByBeaconNode, BeaconValidators} from "./selectors";
import {ValidatorBeaconNodes} from "../../models/validatorBeaconNodes";
import {INetworkConfig} from "../../services/interfaces";
import {getValidatorBalance} from "../../services/utils/validator";
import {getValidatorStatus} from "../../services/utils/getValidatorStatus";
import {CGSlashingProtection} from "../../services/eth2/client/slashingProtection";
import {readFileSync} from "fs";
import {ValidatorStatus} from "../../constants/validatorStatus";
import {getNetworkConfig} from "../../services/eth2/networks";
import {addBeacons, updateEpoch, updateSlot} from "../beacon/actions";
import {computeEpochAtSlot, computeTimeAtSlot} from "@chainsafe/lodestar-beacon-state-transition";
import {getBeaconByKey} from "../beacon/selectors";
import {Beacon, BeaconStatus} from "../beacon/slice";
import {updateStatus} from "../beacon/actions";
import {cgLogger} from "../../../main/logger";
import {Interchange} from "@chainsafe/lodestar-validator/lib/slashingProtection/interchange";
import {createNotification} from "../notification/actions";
import {Level} from "../../components/Notification/NotificationEnums";
import {setInitialValidators, setLoadingValidator} from "../settings/actions";
import {
    CgEth2ApiClient,
    getBeaconNodeEth2ApiClient,
    readBeaconChainNetwork,
    ValidatorLogger,
} from "../../services/eth2/client/module";
import store from "../store";
import {DutyStatus} from "../../constants/dutyStatus";
import {Attestation, Genesis} from "@chainsafe/lodestar-types/altair";
import {config as mainnetConfig} from "../../services/eth2/config/mainet";
import {SLOTS_PER_EPOCH} from "@chainsafe/lodestar-params";
import {Root, ssz} from "@chainsafe/lodestar-types";
import {AttesterDuty, ProposerDuty} from "@chainsafe/lodestar-api/lib/routes/validator";
import {ValidatorResponse} from "@chainsafe/lodestar-api/lib/routes/beacon";
import {Api as LodestarApi} from "@chainsafe/lodestar-api";

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
    | AllEffect<PutEffect>
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
        yield put(setInitialValidators(false));
        yield all(validatorArray.map(({publicKey, network}) => spawn(validatorInfoUpdater, publicKey, network)));

        yield all(validatorArray.map(({publicKey}) => put(startValidatorDutiesWatcher(publicKey))));
    }
}

export function* addNewValidatorSaga(action: ReturnType<typeof addNewValidator>): Generator<PutEffect | ForkEffect> {
    const keystore = action.meta.loadKeystore(action.payload.publicKey);
    const validator: IValidator = {
        name: action.payload.name || `Validator ${action.meta.getValidators().length + 2}`,
        publicKey: action.payload.publicKey,
        network: action.meta!.getValidatorNetwork(action.payload.publicKey),
        keystore,
        status: ValidatorStatus.NO_BEACON_NODE,
        isRunning: false,
        beaconNodes: [],
    };
    cgLogger.info("Adding validator", validator.name, "pubkey", validator.publicKey, "network", validator.network);

    yield put(addValidator(validator));
    yield put(setLoadingValidator(false));
    yield spawn(validatorInfoUpdater, validator.publicKey, validator.network);
    yield put(startValidatorDutiesWatcher(validator.publicKey));
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
        database.validator.attestationEffectiveness.delete(action.payload),
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
    | Promise<{data: Genesis} | null>
    | RaceEffect<TakeEffect>
    | Promise<typeof CgEth2ApiClient>
    | CancelEffect
    | Promise<Validator>,
    void,
    IValidatorComplete &
        [ReturnType<typeof slashingProtectionUpload> | undefined, ReturnType<typeof slashingProtectionCancel>] &
        [ReturnType<typeof stopActiveValidatorService> | undefined, ReturnType<typeof setValidatorStatus>] &
        (INetworkConfig | null) &
        ({data: Genesis} | null) &
        typeof CgEth2ApiClient &
        Validator &
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
        const ApiClient = yield getBeaconNodeEth2ApiClient(validator.beaconNodes[0]);
        const eth2API = new ApiClient(config, validator.beaconNodes[0], {publicKey, dispatch: store.dispatch});

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
                const {
                    data: {genesisValidatorsRoot},
                } = yield eth2API.beacon.getGenesis();
                const interchange = JSON.parse(
                    readFileSync(
                        ((upload as unknown) as ReturnType<typeof slashingProtectionUpload>).payload,
                    ).toString(),
                );
                yield slashingProtection.importInterchange(interchange, genesisValidatorsRoot);
            }
        }

        if (validator.status !== ValidatorStatus.ACTIVE) {
            yield put(setValidatorIsRunning(true, validator.publicKey));
            while (true) {
                const [stop, status] = yield race([take(stopActiveValidatorService), take(setValidatorStatus)]);
                if (stop) yield cancel();
                if (status.meta === validator.publicKey && status.payload === ValidatorStatus.ACTIVE) break;
            }
        }

        const logger = new ValidatorLogger(undefined, publicKey);

        if (!validatorServices[publicKey]) {
            validatorServices[publicKey] = yield Validator.initializeFromBeaconNode({
                slashingProtection,
                api: eth2API as LodestarApi,
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

export function* exportValidatorData({
    payload,
    meta,
}: ReturnType<typeof exportValidator>): Generator<
    CallEffect | SelectEffect | PutEffect | Promise<INetworkConfig | null>,
    void,
    IValidatorComplete & (INetworkConfig | null) & Interchange & Genesis
> {
    const validator = yield select(getValidator, {publicKey: meta});
    cgLogger.log("exporting validator", validator.name);

    try {
        let db: undefined | Interchange;
        if (validator.beaconNodes[0]) {
            const config = (yield readBeaconChainNetwork(validator.beaconNodes[0]))?.eth2Config || mainnetConfig;
            const slashingProtection = new CGSlashingProtection({
                config,
                controller: cgDbController,
            });
            const genesis = yield call(new CgEth2ApiClient(config, validator.beaconNodes[0]).beacon.getGenesis);
            db = yield call(slashingProtection.exportSlashingJson, genesis.genesisValidatorsRoot, meta);
        }

        const name = validator.name
            .toLowerCase()
            .replace(/ /g, "_")
            .replace(/[^a-zA-Z0-9_]/g, "");
        yield call(saveValidatorData, payload, meta, name, db);

        cgLogger.info(`Successfully exported validator ${validator.name} - ${validator.publicKey} to ${payload}.`);
        yield put(
            createNotification({
                source: "exportValidatorData",
                title: `Successfully exported validator ${validator.name} to ${payload}.`,
                level: Level.INFO,
            }),
        );
    } catch (e) {
        cgLogger.error("validator export error", e);
        yield put(
            createNotification({
                source: "exportValidatorData",
                title: `Export failed: ${e.message}`,
                level: Level.ERROR,
            }),
        );
    }
}

export function* getAttestationEffectiveness({
    payload,
    meta,
}: ReturnType<typeof signedNewAttestation>): Generator<
    SelectEffect | TakeEffect | AllEffect<CallEffect> | CallEffect,
    void,
    IValidatorComplete & ReturnType<typeof updateSlot> & ({data: Attestation}[] | null)[] & typeof CgEth2ApiClient
> {
    const validator = yield select(getValidator, {publicKey: meta});
    const config = getNetworkConfig(validator.network)?.eth2Config || mainnetConfig;

    const ApiClient = yield call(getBeaconNodeEth2ApiClient, validator.beaconNodes[0]);
    const eth2API = new ApiClient(config, validator.beaconNodes[0]);

    const {genesisTime} = getNetworkConfig(validator.network);
    yield call(database.validator.attestationDuties.putRecords, meta, [
        {
            slot: payload.slot,
            epoch: computeEpochAtSlot(payload.slot),
            status: DutyStatus.attested,
            timestamp: computeTimeAtSlot(config, payload.slot, genesisTime) * 1000,
        },
    ]);

    let lastSlot = payload.slot,
        empty = 0,
        skipped = 0,
        skippedQue = 0,
        inclusion = 0;
    const timeoutSlot = SLOTS_PER_EPOCH + payload.slot;
    while (true) {
        const newSlot = yield take(updateSlot);
        if (newSlot.meta !== validator.beaconNodes[0]) continue;
        if (lastSlot >= newSlot.payload) continue;

        // get all block information from last to current (mostly is only one but is important to get every block)
        const range = new Array(newSlot.payload - lastSlot).fill(null).map((_, index) => lastSlot + index + 1);
        const results = yield all(range.map((slot) => call(eth2API.beacon.getBlockAttestations, slot)));

        results.forEach((result, index) => {
            /** the main logic for collecting when is attestation may be included and the number of skipped blocks */
            if (result === null) {
                skippedQue++;
            } else {
                const sanitizedAttestations = result.filter(
                    ({data: {data, aggregationBits}}) =>
                        payload.block === ssz.Root.toJson(data.beaconBlockRoot) &&
                        data.index === payload.index &&
                        data.slot === payload.slot &&
                        aggregationBits[payload.validatorIndexInCommittee],
                );
                if (!sanitizedAttestations.length) empty++;
                else {
                    inclusion = range[index];
                    skipped += skippedQue;
                    skippedQue = 0;
                    empty = 0;
                }
            }
        });
        /**
         * break from loop after some number of blocks without information about followed attestations, whit that we
         * can conclude that code fund block where is attestation included and there is no reason to continue this loop
         * (in some rare case can cause premature breaking a loop, if is a problem increase "maxEmptyBlocks")
         * */
        const maxEmptyBlocks = 5;
        if (inclusion !== 0 && empty >= maxEmptyBlocks + skippedQue) break;

        lastSlot = newSlot.payload;
        if (lastSlot > timeoutSlot + skipped) break;
    }
    /**
     * this handle case when is assertion included in block but is not visible in next block
     * like assertion for block 23491 but for some reason is not visible in aggregation on block 23492
     */
    if (inclusion === 0) {
        inclusion = payload.slot + 1;
        skipped = 0;
    }

    // efficiency calculation from https://www.attestant.io/posts/defining-attestation-effectiveness/#malicious-activity
    const efficiency = (payload.slot + 1 + skipped - payload.slot) / (inclusion - payload.slot);

    yield call(database.validator.attestationEffectiveness.addRecord, meta, {
        epoch: computeEpochAtSlot(payload.slot),
        inclusion,
        slot: payload.slot,
        efficiency: efficiency > 1 ? 100 : efficiency > 0 ? Math.floor(efficiency * 100) : 0,
        time: Date.now(),
    });
}

export function* watchValidatorDuties({
    payload,
}: ReturnType<typeof startValidatorDutiesWatcher>): Generator<
    SelectEffect | TakeEffect | CallEffect | Promise<typeof CgEth2ApiClient> | Promise<{data: ValidatorResponse}>,
    void,
    IValidatorComplete &
        typeof CgEth2ApiClient & {data: ValidatorResponse} & ReturnType<typeof updateEpoch> &
        Beacon &
        ReturnType<typeof setValidatorBeaconNode>
> {
    let validator: IValidatorComplete = yield select(getValidator, {publicKey: payload});
    if (!validator.beaconNodes.length) {
        while (true) {
            const updatedValidator = yield take(setValidatorBeaconNode);
            if (updatedValidator.payload.length && validator.publicKey === updatedValidator.meta) {
                validator = {...validator, beaconNodes: updatedValidator.payload};
                break;
            }
        }
    }

    const config = getNetworkConfig(validator.network)?.eth2Config || mainnetConfig;
    const {genesisTime} = getNetworkConfig(validator.network);

    const ApiClient = yield getBeaconNodeEth2ApiClient(validator.beaconNodes[0]);
    const eth2API = new ApiClient(config, validator.beaconNodes[0]);

    const validatorState = yield eth2API.beacon.getStateValidator("head", payload);

    function* processDuties(
        epoch: number,
    ): Generator<
        | AllEffect<CallEffect>
        | Promise<{data: AttesterDuty[]; dependentRoot: Root}>
        | Promise<{data: ProposerDuty[]; dependentRoot: Root}>,
        void,
        {data: AttesterDuty[]; dependentRoot: Root} & {data: ProposerDuty[]; dependentRoot: Root}
    > {
        let attestations: AttesterDuty[], attestationsFuture: AttesterDuty[];
        try {
            try {
                attestations = (yield eth2API.validator.getAttesterDuties(epoch, [validatorState.data.index])).data;
            } catch {
                attestations = (yield eth2API.validator.getAttesterDuties(epoch, [validatorState.data.index])).data;
            }
            attestationsFuture = (yield eth2API.validator.getAttesterDuties(epoch + 1, [validatorState.data.index]))
                .data;
        } catch (e) {
            attestations = attestations || [];
            attestationsFuture = [];
            cgLogger.warn("processDuties attestations", e);
        }

        let propositions: ProposerDuty[], propositionsFuture: ProposerDuty[], propositionsSuperFuture: ProposerDuty[];
        try {
            // TODO: validate!!!!
            propositions = (yield eth2API.validator.getProposerDuties(epoch)).data;
            propositionsFuture = (yield eth2API.validator.getProposerDuties(epoch + 1)).data;
            propositionsSuperFuture = (yield eth2API.validator.getProposerDuties(epoch + 2)).data;
        } catch (e) {
            propositions = propositions || [];
            propositionsFuture = propositionsFuture || [];
            propositionsSuperFuture = [];
            cgLogger.warn("processDuties propositions", e);
        }

        // store data to database
        yield all([
            call(
                database.validator.attestationDuties.putRecords,
                payload,
                [...attestations, ...attestationsFuture]
                    .filter(({validatorIndex}) => validatorIndex === validatorState.data.index)
                    .map(({slot}) => ({
                        slot,
                        epoch: computeEpochAtSlot(slot),
                        status: DutyStatus.scheduled,
                        timestamp: computeTimeAtSlot(config, slot, genesisTime) * 1000,
                    })),
            ),
            call(
                database.validator.propositionDuties.putRecords,
                payload,
                [...propositions, ...propositionsFuture, ...propositionsSuperFuture]
                    .filter(({validatorIndex}) => validatorIndex === validatorState.data.index)
                    .map(({slot}) => ({
                        slot,
                        epoch: computeEpochAtSlot(slot),
                        status: DutyStatus.scheduled,
                        timestamp: computeTimeAtSlot(config, slot, genesisTime) * 1000,
                    })),
            ),
        ]);
    }

    let beaconNode = yield select(getBeaconByKey, {key: validator.beaconNodes[0]});
    if (!beaconNode) {
        yield take(addBeacons);
        beaconNode = yield select(getBeaconByKey, {key: validator.beaconNodes[0]});
    }
    if (beaconNode.status !== BeaconStatus.active) {
        while (true) {
            const newStatus = yield take(updateStatus);
            if (newStatus.payload === BeaconStatus.active && newStatus.meta === beaconNode.url) break;
        }
    }

    yield call(processDuties, computeEpochAtSlot(beaconNode.slot));
    while (true) {
        const newEpoch = yield take(updateEpoch);
        if (newEpoch.meta !== validator.beaconNodes[0]) continue;
        yield call(processDuties, newEpoch.payload);
    }
}

function* updateDutiesStatus({
    payload,
    meta,
}: ReturnType<typeof updateSlot>): Generator<SelectEffect | AllEffect<AllEffect<CallEffect>>, void, BeaconValidators> {
    const validatorsByBeaconNode = yield select(getValidatorsByBeaconNode);
    if (validatorsByBeaconNode[meta])
        yield all(
            validatorsByBeaconNode[meta].map(({publicKey}) =>
                all([
                    call(database.validator.propositionDuties.updateMissed, publicKey, payload),
                    call(database.validator.attestationDuties.updateMissed, publicKey, payload),
                ]),
            ),
        );
}

function* onPublishedBlock({
    payload,
    meta,
}: ReturnType<typeof publishNewBlock>): Generator<CallEffect | SelectEffect, void, IValidatorComplete> {
    const validator = yield select(getValidator, {publicKey: meta});
    const config = getNetworkConfig(validator.network)?.eth2Config || mainnetConfig;

    const {genesisTime} = getNetworkConfig(validator.network);
    yield call(database.validator.propositionDuties.putRecords, meta, [
        {
            slot: payload.slot,
            epoch: computeEpochAtSlot(payload.slot),
            status: DutyStatus.proposed,
            timestamp: computeTimeAtSlot(config, payload.slot, genesisTime) * 1000,
        },
    ]);
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
        takeEvery(signedNewAttestation, getAttestationEffectiveness),
        takeEvery(exportValidator, exportValidatorData),
        takeLatest(startValidatorDutiesWatcher, watchValidatorDuties),
        takeEvery(updateSlot, updateDutiesStatus),
        takeEvery(publishNewBlock, onPublishedBlock),
    ]);
}
