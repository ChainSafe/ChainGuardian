import {Keypair as KeyPair} from "@chainsafe/bls/lib/keypair";
import bls from "@chainsafe/bls";
import {BLSPubkey as BLSPubKey, bytes32, bytes48, bytes96, Hash} from "@chainsafe/eth2.0-types";
import {createHash} from "crypto";
import {DepositData} from "@chainsafe/eth2.0-types/lib/misc";
import BN from "bn.js";
import {signingRoot, SimpleContainerType} from "@chainsafe/ssz";
import {BLSDomain} from "@chainsafe/bls/lib/types";
import abi from "ethereumjs-abi";

// data type definition for DepositData
const depositDataType: SimpleContainerType = {
    fields: [
        ["pubkey", "bytes48"],
        ["withdrawalCredentials", "bytes32"],
        ["amount", "uint64"],
        ["signature", "bytes96"]
    ]
};

// fixed deposit amount
const depositAmount: BN = new BN(30000000000);

// fixed BLS domain - deposit - 3
const depositBLSDomain: BLSDomain = Buffer.from(Uint8Array.from([3]));

// definition of contracts deposit function
const depositFunctionSignature = "deposit(bytes,bytes,bytes,bytes32)";

const depositContractAdress = "0x9c86825280b1d6c7dB043D4CC86E1549990149f9";

// Deposit ETH 2.0

export interface IDepositParams {
    publicKey: bytes48;
    withdrawalCredentials: bytes32;
    signature: bytes96;
    root: Hash
}

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
        Uint8Array.from([0]),
        createHash("sha256").update(withdrawalPubKey).digest().subarray(1)
    ]);
    // define DepositData
    const depositData = {
        pubkey: publicKey,
        withdrawalCredentials: withdrawalCredentials,
        amount: depositAmount,
        signature: Buffer.alloc(0)
    } as DepositData;
    // calculate root
    const root = signingRoot(depositData, depositDataType);
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

export interface ITx {
    to: string;
    value: string;
    data: string;
}

export function generateEth1DepositTx(depositParams: IDepositParams): ITx {
    const encoded = abi.simpleEncode(
        depositFunctionSignature,
        depositParams.publicKey,
        depositParams.withdrawalCredentials,
        depositParams.signature,
        depositParams.root
    );
    return {
        data: encoded.toString(),
        to: depositContractAdress,
        value: depositAmount.toString("hex")
    } as ITx;
}