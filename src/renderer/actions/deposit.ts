import {DepositActionTypes} from "../constants/action-types";
import {Action, Dispatch} from "redux";
import {IRootState} from "../reducers";
import {INetworkConfig} from "../services/interfaces";
import {DepositTx, generateDeposit} from "../services/deposit";
import {Keypair} from "@chainsafe/bls/lib/keypair";
import {PrivateKey} from "@chainsafe/bls/lib/privateKey";
import {EthersNotifier} from "../services/deposit/ethers";

// Generate deposit action
export const generateDepositAction = (networkConfig: INetworkConfig) => {
    return (dispatch: Dispatch<IGenerateDepositAction>, getState: () => IRootState): void => {
        const {signingKey, withdrawalKey} = getState().register;
        const keyPair = new Keypair(PrivateKey.fromHexString(signingKey));
        // Call deposit service and dispatch action
        const depositData = generateDeposit(
            keyPair,
            Buffer.from(withdrawalKey, "hex"),
            networkConfig.contract.depositAmount
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
    return async (dispatch: Dispatch<Action<DepositActionTypes>>, getState: () => IRootState): Promise<void> => {
        dispatch(setWaitingDeposit());
        const signingKey = getState().register.signingKey;
        const keyPair = new Keypair(PrivateKey.fromHexString(signingKey));
        const provider = networkConfig.eth1Provider;
        const ethersNotifier = new EthersNotifier(networkConfig, provider, keyPair);
        // Call deposit service and listen for event, when transaction is visible dispatch action
        ethersNotifier.depositEventListener(timeout)
            .then(() => {
                dispatch(setDepositDetected());
            })
            .catch(() => {
                dispatch(setDepositNotFound());
            });
        const hasDeposited = await ethersNotifier.checkUserDepositAmount();
        if(hasDeposited) {
            dispatch(setDepositDetected());
            return;
        }
    };
};

export const setDepositTransactionData = (txData: string): IGenerateDepositAction => ({
    type: DepositActionTypes.STORE_DEPOSIT_TX_DATA, payload: {txData}
});


export const setWaitingDeposit = (): Action<DepositActionTypes> => ({
    type: DepositActionTypes.WAIT_FOR_DEPOSIT
});
export const setDepositDetected = (): Action<DepositActionTypes> => ({
    type: DepositActionTypes.DEPOSIT_DETECTED
});

export const setDepositNotFound = (): Action<DepositActionTypes> => ({
    type: DepositActionTypes.DEPOSIT_NOT_FOUND
});

export const resetDepositData = (): Action<DepositActionTypes> => ({
    type: DepositActionTypes.RESET
});

export interface IGenerateDepositPayload {
    txData: string;
}

export interface IGenerateDepositAction extends Action<DepositActionTypes> {
    payload: IGenerateDepositPayload;
}

