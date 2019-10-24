import {BLSDomain} from "@chainsafe/bls/lib/types";
import BN from "bn.js";

// defined amount to deposit
export const depositAmountInEth = 32;

// domain_type + fork_version
export const depositBLSDomain: BLSDomain =
    Buffer.concat([new BN(3).toArrayLike(Buffer, "le", 4), Buffer.alloc(4)]);

export const gasLimitDepositTransaction = "0x1E8480";