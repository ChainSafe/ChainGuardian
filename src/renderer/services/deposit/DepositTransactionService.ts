import {Keypair as KeyPair} from "@chainsafe/bls/lib/keypair";
import bls from "@chainsafe/bls";
import {BLSPubkey as BLSPubKey, bytes, DepositData} from "@chainsafe/eth2.0-types";
import {createHash} from "crypto";
import {signingRoot} from "@chainsafe/ssz";
import abi from "ethereumjs-abi";
import {config} from "@chainsafe/eth2.0-config/lib/presets/mainnet";
import {IDepositParams, ITx} from "./types";
import Wallet from "ethereumjs-wallet";
import {Transaction} from "ethereumjs-tx";
import {functionSignatureFromABI} from "./utils";
import {EthConverter, toHexString} from "../utils/crypto-utils";
import options from "../../../../src/renderer/services/deposit/options";
import {depositAmountInEth, depositBLSDomain} from "./constants";

// Deposit ETH 2.0

/**
 * Generate deposit params.
 *
 * @param signingKey
 * @param withdrawalPubKey
 *
 * @return instance of ${DepositData}
 */
export function generateDeposit(signingKey: KeyPair, withdrawalPubKey: BLSPubKey): IDepositParams {
    // signing public key
    const publicKey = signingKey.publicKey.toBytesCompressed();
    // BLS_WITHDRAWAL_PREFIX + hash(withdrawal_pubkey)[1:]
    const withdrawalCredentials = Buffer.concat([
        Buffer.alloc(1),
        createHash("sha256").update(withdrawalPubKey).digest().subarray(1)
    ]);
    // define DepositData
    const depositData: DepositData = {
        pubkey: publicKey,
        withdrawalCredentials: withdrawalCredentials,
        amount: EthConverter.toGwei(depositAmountInEth),
        signature: Buffer.alloc(0)
    };
    // calculate root
    const root = signingRoot(depositData, config.types.DepositData);
    // sign calculated root
    const signature = bls.sign(signingKey.privateKey.toBytes(), root, depositBLSDomain);
    return {
        publicKey,
        withdrawalCredentials,
        signature,
        root
    } as IDepositParams;
}


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
    static generateDepositTx(depositParams: IDepositParams, depositContractAddress: string): DepositTx {
        const depositFunctionEncoded = abi.simpleEncode(
            functionSignatureFromABI(options.depositContract.abi, "deposit"),
            depositParams.publicKey,
            depositParams.withdrawalCredentials,
            depositParams.signature,
        );
        return new DepositTx(
            depositFunctionEncoded,
            depositContractAddress,
            toHexString(EthConverter.toWei(depositAmountInEth))
        );
    }

    /**
     * 
     * @param wallet
     */
    sign(wallet: Wallet): string {
        const txData = {
            ...this,
            gasLimit: "0x1E8480", // TODO gasLimit ?
        };
        const tx = new Transaction(txData);
        tx.sign(wallet.getPrivateKey());
        return tx.serialize().toString("hex");
    }
}
