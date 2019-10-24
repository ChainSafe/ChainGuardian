import {Keypair as KeyPair} from "@chainsafe/bls/lib/keypair";
import {BLSPubkey as BLSPubKey, bytes, DepositData} from "@chainsafe/eth2.0-types";
import {createHash} from "crypto";
import {signingRoot} from "@chainsafe/ssz";
import abi from "ethereumjs-abi";
import {config} from "@chainsafe/eth2.0-config/lib/presets/mainnet";
import {ITx} from "./types";
import Wallet from "ethereumjs-wallet";
import {Transaction} from "ethereumjs-tx";
import {functionSignatureFromABI} from "./utils";
import {EthConverter, toHexString} from "../utils/crypto-utils";
import options from "../../../../src/renderer/services/deposit/options";
import {depositAmountInEth, depositBLSDomain, gasLimitDepositTransaction} from "./constants";
import {G2point} from "@chainsafe/bls/lib/helpers/g2point";

/**
 * Generate deposit params.
 *
 * @param signingKey
 * @param withdrawalPubKey
 *
 * @return instance of ${DepositData}
 */
export function generateDeposit(signingKey: KeyPair, withdrawalPubKey: BLSPubKey): DepositData {
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
    depositData.signature = signingKey.privateKey.sign(
        G2point.hashToG2(root, depositBLSDomain)
    ).toBytesCompressed();
    return depositData;
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
            gasLimit: gasLimitDepositTransaction,
        };
        const tx = new Transaction(txData);
        tx.sign(wallet.getPrivateKey());
        return tx.serialize().toString("hex");
    }
}
