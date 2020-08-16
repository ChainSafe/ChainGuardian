import {INetworkConfig} from "../../services/interfaces";
import {Dispatch} from "redux";
import {IRootState} from "../../reducers";
import {Keypair, PrivateKey} from "@chainsafe/bls";
import {fromHex} from "../../services/utils/bytes";
import {DepositTx, generateDeposit} from "../../services/deposit";
import {EthersNotifier} from "../../services/deposit/ethers";
import {
    DepositAction,
    DepositActionTypes,
    DepositDetectionAction,
    DepositNotFoundAction,
    GenerateDepositAction,
    ResetDepositDataAction,
    WaitForDepositAction
} from "./types";

export * from "./types";

// Generate deposit action
export const generateDepositAction = (networkConfig: INetworkConfig) => {
    return (dispatch: Dispatch<GenerateDepositAction>, getState: () => IRootState): void => {
        const {signingKey, withdrawalKey} = getState().register;
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
        const txData = typeof depositTx.data === "object" ?
            `0x${depositTx.data.toString("hex")}` : `0x${depositTx.data}`;

        dispatch(setDepositTransactionData(txData));
    };
};

// Verify deposit action
export const verifyDepositAction = (networkConfig: INetworkConfig, timeout = 30000) => {
    return async (dispatch: Dispatch<DepositAction>, getState: () => IRootState): Promise<void> => {
        dispatch(setWaitingDeposit());
        const signingKey = getState().register.signingKey;
        const keyPair = new Keypair(PrivateKey.fromHexString(signingKey));
        const provider = networkConfig.eth1Provider;
        const ethersNotifier = new EthersNotifier(networkConfig, provider);
        // Call deposit service and listen for event, when transaction is visible dispatch action
        ethersNotifier.depositEventListener(keyPair.publicKey, timeout)
            .then(() => {
                dispatch(setDepositDetected());
            })
            .catch(() => {
                dispatch(setDepositNotFound());
            });
        const hasDeposited = await ethersNotifier.hasUserDeposited(keyPair.publicKey);
        if(hasDeposited) {
            dispatch(setDepositDetected());
            return;
        }
    };
};

export const setDepositTransactionData = (txData: string): GenerateDepositAction => ({
    type: DepositActionTypes.STORE_DEPOSIT_TX_DATA, payload: {txData}
});

export const setWaitingDeposit = (): WaitForDepositAction => ({
    type: DepositActionTypes.WAIT_FOR_DEPOSIT
});
export const setDepositDetected = (): DepositDetectionAction => ({
    type: DepositActionTypes.DEPOSIT_DETECTED
});

export const setDepositNotFound = (): DepositNotFoundAction => ({
    type: DepositActionTypes.DEPOSIT_NOT_FOUND
});

export const resetDepositData = (): ResetDepositDataAction => ({
    type: DepositActionTypes.RESET_DEPOSIT_DATA
});

