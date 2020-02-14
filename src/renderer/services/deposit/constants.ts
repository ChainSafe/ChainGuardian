import {Domain} from "@chainsafe/eth2.0-types";
import { toBufferLE } from 'bigint-buffer';

// domain_type + fork_version
export const DEPOSIT_DOMAIN: Domain =
    Buffer.concat([toBufferLE(BigInt(3), 4), Buffer.alloc(4)]);

export const DEPOSIT_TX_GAS = "0x1E8480";