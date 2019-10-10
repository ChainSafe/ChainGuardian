import {Keypair as KeyPair} from "@chainsafe/bls/lib/keypair";
import { BLSPubkey as BLSPubKey, bytes32, bytes96, Hash } from '@chainsafe/eth2.0-types';

export interface DepositParams {
    withdrawalCredentials: bytes32;
    signature: bytes96;
    root: Hash
}

export function generateDeposit(signingKey: KeyPair, withdrawalPubKey: BLSPubKey): DepositParams {
    return {

    } as DepositParams;
}

export interface Tx {
    to: string;
    value: string;
    data: string;
}

export function generateEth1DepositTx(depositParams: DepositParams): Tx {
    return {

    } as Tx;
}