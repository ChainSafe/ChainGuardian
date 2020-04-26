import {ContainerType, ListType} from "@chainsafe/ssz";
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