import {ContainerType} from "@chainsafe/ssz";
import {BeaconNode} from "../beaconNode";
import {StringType} from "./basic";

export const BeaconNodeType = new ContainerType<BeaconNode>({
    fields: {
        "url": new StringType(),
        "localDockerId": new StringType()
    }
});