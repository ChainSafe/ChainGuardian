import {Root, Slot} from "@chainsafe/lodestar-types";
import {ContainerType, NumberUintType, RootType} from "@chainsafe/ssz";

export interface IEth2ChainHead {
    slot: Slot;
    blockRoot: Root;
    stateRoot: Root;
}

export const Eth2ChainHeadType = new ContainerType<IEth2ChainHead>({
    fields: {
        slot: new NumberUintType({byteLength: 4}),
        blockRoot: new RootType({expandedType: null}),
        stateRoot: new RootType({expandedType: null}),
    },
});
