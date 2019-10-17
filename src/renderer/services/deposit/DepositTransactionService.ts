import {Keypair as KeyPair} from "@chainsafe/bls/lib/keypair";
import bls from "@chainsafe/bls";
import {BLSPubkey as BLSPubKey, bytes} from "@chainsafe/eth2.0-types";
import {createHash} from "crypto";
import {DepositData} from "@chainsafe/eth2.0-types/lib/misc";
import BN from "bn.js";
import {signingRoot} from "@chainsafe/ssz";
import {BLSDomain} from "@chainsafe/bls/lib/types";
import abi from "ethereumjs-abi";
import {config} from "@chainsafe/eth2.0-config/lib/presets/mainnet";
import {IDepositParams, ITx} from "./types";

// fixed deposit amount
const depositAmountInEth = 32;

// fixed BLS domain -> deposit = 3
const depositBLSDomain: BLSDomain =
    // domain_type + fork_version
    Buffer.concat([new BN(3).toArrayLike(Buffer, "le", 4), Buffer.alloc(4)]);

// definition of contracts deposit function
const depositFunctionSignature = "deposit(bytes,bytes,bytes,bytes32)";

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
        amount: new BN(depositAmountInEth * 1e9),
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

    static generateDepositTx(depositParams: IDepositParams, depositContractAddress: string): DepositTx {
        const depositFunctionEncoded = abi.simpleEncode(
            depositFunctionSignature,
            depositParams.publicKey,
            depositParams.withdrawalCredentials,
            depositParams.signature,
            depositParams.root
        );

        return new DepositTx(
            depositFunctionEncoded.toString(),
            depositContractAddress,
            (new BN(10e18)).mul(new BN(depositAmountInEth)).toString()
        );
    }

    // TODO
    // sign(wallet?: any): DepositTx {
    //     return this;
    // }
}
