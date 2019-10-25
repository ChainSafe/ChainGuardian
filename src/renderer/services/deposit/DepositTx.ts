import {bytes, DepositData} from "@chainsafe/eth2.0-types";
import abi from "ethereumjs-abi";
import {ITx} from "./types";
import Wallet from "ethereumjs-wallet";
import {Transaction} from "ethereumjs-tx";
import {functionSignatureFromABI} from "./utils";
import {EthConverter, toHexString} from "../utils/crypto-utils";
import options from "../../../../src/renderer/services/deposit/options";
import {DEPOSIT_AMOUNT, DEPOSIT_TX_GAS} from "./constants";

export class DepositTx implements ITx{
    data: string | bytes;
    to: string;
    value: string;

    constructor(data: string | bytes, to: string, value: string) {
        this.data = data;
        this.to = to;
        this.value = value;
    }

    /**
     *
     * @param depositParams
     * @param depositContractAddress
     */
    static generateDepositTx(depositParams: DepositData, depositContractAddress: string): DepositTx {
        const depositFunctionEncoded = abi.simpleEncode(
            functionSignatureFromABI(options.depositContract.abi, "deposit"),
            depositParams.pubkey,
            depositParams.withdrawalCredentials,
            depositParams.signature,
        );
        return new DepositTx(
            depositFunctionEncoded,
            depositContractAddress,
            toHexString(EthConverter.toWei(DEPOSIT_AMOUNT))
        );
    }

    /**
     *
     * @param wallet
     */
    sign(wallet: Wallet): string {
        const txData = {
            ...this,
            gasLimit: DEPOSIT_TX_GAS,
        };
        const tx = new Transaction(txData);
        tx.sign(wallet.getPrivateKey());
        return tx.serialize().toString("hex");
    }
}
