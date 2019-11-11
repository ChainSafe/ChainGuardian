import {bytes, DepositData} from "@chainsafe/eth2.0-types";
import abi from "ethereumjs-abi";
import {ITx} from "./types";
import {functionSignatureFromABI} from "./utils";
import DepositContract from "../../../../src/renderer/services/deposit/options";
import {DEPOSIT_AMOUNT, DEPOSIT_TX_GAS} from "./constants";
import {hashTreeRoot} from "@chainsafe/ssz";
import {Wallet} from "ethers/wallet";
import {utils} from "ethers";
import {IBeaconConfig} from "@chainsafe/eth2.0-config";

export class DepositTx implements ITx{
    public data: string | bytes;
    public to: string;
    public value: string;

    public constructor(data: string | bytes, to: string, value: string) {
        this.data = data;
        this.to = to;
        this.value = value;
    }

    /**
     * Create instance of @{DepositTx} from arguments.
     *
     * @param depositParams - @{DepositData} object.
     * @param depositContractAddress - address of deployed deposit contract.
     */
    public static generateDepositTx(
        depositParams: DepositData, 
        depositContractAddress: string, 
        config: IBeaconConfig,
        depositAmount: string): DepositTx {
        // calculate root
        const depositDataRoot = hashTreeRoot(depositParams, config.types.DepositData);
        const depositFunctionEncoded = abi.simpleEncode(
            functionSignatureFromABI(DepositContract.abi, "deposit"),
            depositParams.pubkey,
            depositParams.withdrawalCredentials,
            depositParams.signature,
            depositDataRoot
        );

        return new DepositTx(
            depositFunctionEncoded,
            depositContractAddress,
            utils.parseEther(depositAmount).toHexString()
        );
    }

    /**
     * Sign this transaction using provided wallet.
     *
     * @param wallet - ethereumjs instance of wallet.
     * @return - transaction signature.
     */
    public async sign(wallet: Wallet, nonce = 0): Promise<string> {
        const txData = {
            ...this,
            nonce,
            gasLimit: DEPOSIT_TX_GAS,
        };
        return wallet.sign(txData);
    }
}
