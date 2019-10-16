import {Keypair as KeyPair} from "@chainsafe/bls/lib/keypair";
import bls from "@chainsafe/bls";
import {BLSPubkey as BLSPubKey} from "@chainsafe/eth2.0-types";
import {createHash} from "crypto";
import {DepositData} from "@chainsafe/eth2.0-types/lib/misc";
import BN from "bn.js";
import {signingRoot} from "@chainsafe/ssz";
import {BLSDomain} from "@chainsafe/bls/lib/types";
import abi from "ethereumjs-abi";
import {config} from "@chainsafe/eth2.0-config/lib/presets/mainnet";
import Units from "ethereumjs-units";
import {IDepositParams, ITx} from "./DepositTransactionTypes";

// fixed deposit amount
const depositAmountInEth = "32";

// fixed BLS domain -> deposit = 3
const depositBLSDomain: BLSDomain =
    Buffer.concat([new BN(3).toArrayLike(Buffer, "le", 4), Buffer.alloc(4)]);

// definition of contracts deposit function
const depositFunctionSignature = "deposit(bytes,bytes,bytes,bytes32)";

// deposit contract address
const depositContractAddress = "0x9c86825280b1d6c7dB043D4CC86E1549990149f9";

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
        amount: new BN(Units.convert(depositAmountInEth, "eth", "gwei")),
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

// Deposit ETH 1.0

/**
 *
 * @param depositParams
 */
export function generateEth1DepositTx(depositParams: IDepositParams): ITx {
    const depositFunctionEncoded = abi.simpleEncode(
        depositFunctionSignature,
        depositParams.publicKey,
        depositParams.withdrawalCredentials,
        depositParams.signature,
        depositParams.root
    );
    return {
        data: depositFunctionEncoded.toString(),
        to: depositContractAddress,
        value: Units.convert(depositAmountInEth, "eth", "wei")
    } as ITx;
}