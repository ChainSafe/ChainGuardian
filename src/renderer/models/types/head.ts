import {ContainerType, NumberUintType, RootType} from "@chainsafe/ssz";
import {IEth2ChainHead} from "../head";

export const Eth2ChainHeadType = new ContainerType<IEth2ChainHead>({
    fields: {
        slot: new NumberUintType({byteLength: 4}),
        blockRoot: new RootType({expandedType: null}),
        stateRoot: new RootType({expandedType: null})
    }
});