import {BLSDomain} from "@chainsafe/bls/lib/types";
import BN from "bn.js";

// defined amount to deposit
export const DEPOSIT_AMOUNT = 32;

// domain_type + fork_version
export const DEPOSIT_DOMAIN: BLSDomain =
    Buffer.concat([new BN(3).toArrayLike(Buffer, "le", 4), Buffer.alloc(4)]);

export const DEPOSIT_TX_GAS = "0x1E8480";