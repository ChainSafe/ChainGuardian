import {bytes} from "@chainsafe/eth2.0-types";

/**
 * Params for calling deposit contract on eth1
 */
export interface ITx {
    to: string;
    value: string;
    data: string | bytes;
}