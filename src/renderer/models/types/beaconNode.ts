import {ContainerType, ListType, NumberUintType} from "@chainsafe/ssz";
import {BeaconNode, BeaconNodes} from "../beaconNode";
import {StringType} from "./basic";

export const BeaconNodeType = new ContainerType<BeaconNode>({
    fields: {
        "url": new StringType(),
        "localDockerId": new StringType()
    }
});

export const BeaconNodesType = new ContainerType<BeaconNodes>({
    fields: {
        nodes: new ListType({elementType: BeaconNodeType, limit: 5})
    }
});

export interface ISpecResponse {
    genesisSlot: number;
    genesisForkVersion: string;
}

export const SpecType = new ContainerType<ISpecResponse>({
    fields: {
        genesisSlot: new NumberUintType({byteLength: 4}),
        genesisForkVersion: new StringType(),
    }
});
