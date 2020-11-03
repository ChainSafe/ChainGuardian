import {all, takeEvery, select, put, SelectEffect, PutEffect} from "redux-saga/effects";
import {Keypair, PrivateKey} from "@chainsafe/bls";
import {fromHex} from "../../services/utils/bytes";
import {DepositTx, generateDeposit} from "../../services/deposit";
import {EthersNotifier} from "../../services/deposit/ethers";
import {
    generateDeposit as generateDepositAction,
    verifyDeposit as verifyDepositAction,
    storeDepositTx,
    depositDetected, depositNotFount
} from "./actions";

function* generateDepositSaga({payload: networkConfig}: ReturnType<typeof generateDepositAction>):
// TODO: Remove any with real type
Generator<SelectEffect | PutEffect, void, any> {
    // TODO: use sector
    const {signingKey, withdrawalKey} = yield select(s => s.register);

    const keyPair = new Keypair(PrivateKey.fromBytes(fromHex(signingKey)));
    // Call deposit service and dispatch action
    const depositData = generateDeposit(
        keyPair,
        fromHex(withdrawalKey),
        networkConfig.contract.depositAmount,
        networkConfig.eth2Config,
    );
    const depositTx = DepositTx.generateDepositTx(
        depositData,
        networkConfig.contract.address,
        networkConfig.eth2Config,
        networkConfig.contract.depositAmount);

    // Ask Question about this
    const txData = typeof depositTx.data === "object" ?
        `0x${depositTx.data.toString("hex")}` : `0x${depositTx.data}`;
    // ENDq

    yield put(storeDepositTx(txData));
}

function* verifyDeposit({payload: {networkConfig, timeout}}: ReturnType<typeof verifyDepositAction>):
Generator<SelectEffect | Promise<BigInt> | Promise<boolean> | PutEffect, void, (string & boolean)> {
    // TODO: decide what approach to use #1
    // yield put(setWaitingDeposit());
    // TODO: use sector
    const signingKey: string = yield select(s => s.register.signingKey);

    const keyPair = new Keypair(PrivateKey.fromHexString(signingKey));

    const provider = networkConfig.eth1Provider;
    const ethersNotifier = new EthersNotifier(networkConfig, provider);

    // Call deposit service and listen for event, when transaction is visible dispatch action
    // TODO: Refactor entire logic and service logic
    try {
        yield ethersNotifier.depositEventListener(keyPair.publicKey, timeout);
        yield put(depositDetected());
    } catch {
        yield put(depositNotFount());
    }

    // TODO note to myself: if request resolve() or reject() still check lock if is deposit made?
    // Is there point of using logic like this? or will be better to use different approach
    const hasDeposited: boolean = yield ethersNotifier.hasUserDeposited(keyPair.publicKey);
    if(hasDeposited) {
        yield put(depositDetected());
    }
}

export function* depositSagaWatcher(): Generator {
    yield all([
        takeEvery(generateDepositAction, generateDepositSaga),
        takeEvery(verifyDepositAction, verifyDeposit),
    ]);
}
