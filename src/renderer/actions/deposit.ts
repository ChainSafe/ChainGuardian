import {DepositActionTypes} from "../constants/action-types";
import {Action, Dispatch} from "redux";
import {IRootState} from "../reducers";
import {INetworkConfig} from "../services/interfaces";
import {ethers} from "ethers";
import {generateDeposit, DepositTx} from "../services/deposit";
import {Keypair} from "@chainsafe/bls/lib/keypair";
import {PrivateKey} from "@chainsafe/bls/lib/privateKey";
import {EthersNotifier} from "../services/deposit/ethers";

// Generate deposit action
export const generateDepositAction = (networkConfig: INetworkConfig, amount: string) => {
    return (dispatch: Dispatch<IGenerateDepositAction>, getState: () => IRootState): void => {
        const signingKey = getState().register.signingKey;
        const keyPair = new Keypair(PrivateKey.fromHexString(signingKey));
        // Call deposit service and dispatch action
        const depositData = generateDeposit(keyPair, Buffer.alloc(48, 1, "hex"), amount);
        const depositTx = DepositTx.generateDepositTx(
            depositData,
            networkConfig.contract.address,
            networkConfig.config,
            amount);
        const txData = typeof depositTx.data === "object" ?
            `0x${depositTx.data.toString("hex")}` : `0x${depositTx.data}`;

        dispatch(setDepositGenerated(true));
        dispatch(setDepositTransactionData(txData));
    };
};

// Verify deposit action
export const verifyDepositAction = (networkConfig: INetworkConfig, networkName: string) => {
    return (dispatch: Dispatch<IVerifyDepositAction>, getState: () => IRootState): void => {
        const signingKey = getState().register.signingKey;
        const keyPair = new Keypair(PrivateKey.fromHexString(signingKey));
        const provider = ethers.getDefaultProvider(networkName.toLowerCase());
        const ethersNotifier = new EthersNotifier(networkConfig, provider, keyPair);

        // Call deposit service and listen for event, when transaction is visible dispatch action
        ethersNotifier.depositEventListener(5000)
            .then(() => {
                dispatch(setDepositVisible(true));
            })
            .catch(() => {
                dispatch(setDepositVisible(false));
            });
    };
};


export const setDepositGenerated = (isDepositGenerated: boolean): IGenerateDepositAction => ({
    type: DepositActionTypes.GENERATE_DEPOSIT, payload: {isDepositGenerated}
});

export const setDepositTransactionData = (txData: string): IGenerateDepositAction => ({
    type: DepositActionTypes.DEPOSIT_TRANSACTION, payload: {txData}
});


export const setDepositVisible = (isDepositVisible: boolean): IVerifyDepositAction => ({
    type: DepositActionTypes.DEPOSIT_VISIBLE, payload: {isDepositVisible}
});

export interface IGenerateDepositPayload {
    isDepositGenerated?: boolean;
    txData?: string;
}

export interface IGenerateDepositAction extends Action<DepositActionTypes> {
    payload: IGenerateDepositPayload;
}

export interface IVerifyDepositPayload {
    isDepositVisible: boolean;
}
export interface IVerifyDepositAction extends Action<DepositActionTypes> {
    payload: IVerifyDepositPayload;
}

