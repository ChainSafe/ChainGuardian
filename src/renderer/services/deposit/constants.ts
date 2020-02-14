import {Domain} from "@chainsafe/eth2.0-types";
import BN from "bn.js";

// domain_type + fork_version
export const DEPOSIT_DOMAIN: Domain =
    Buffer.concat([new BN(3).toArrayLike(Buffer, "le", 4), Buffer.alloc(4)]);

export const DEPOSIT_TX_GAS = "0x1E8480";