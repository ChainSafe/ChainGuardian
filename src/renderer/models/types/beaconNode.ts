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

export interface SpecResponse {
    genesis_slot: number;
    genesis_fork_version: string;
}

export const SpecType = new ContainerType<SpecResponse>({
    fields: {
        genesis_slot: new NumberUintType({byteLength: 4}),
        genesis_fork_version: new StringType(),
    }
});
