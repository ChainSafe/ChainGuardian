import {bytes, bytes32, bytes48, bytes96, Hash} from "@chainsafe/eth2.0-types";

export interface IDepositParams {
    publicKey: bytes48;
    withdrawalCredentials: bytes32;
    signature: bytes96;
    root: Hash
}

export interface ITx {
    to: string;
    value: string;
    data: string | bytes;
}