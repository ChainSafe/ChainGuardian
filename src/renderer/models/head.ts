import {Root, Slot} from "@chainsafe/lodestar-types";

export interface IEth2ChainHead {
    slot: Slot,
    blockRoot: Root,
    stateRoot: Root,
}