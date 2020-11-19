import {ContainerType, ListType} from "@chainsafe/ssz";
import {StringType} from "./basic";
import {Beacon, Beacons} from "../beacons";

export const BeaconType = new ContainerType<Beacon>({
    fields: {
        url: new StringType(),
        localDockerId: new StringType(),
    },
});

export const BeaconsType = new ContainerType<Beacons>({
    fields: {
        beacons: new ListType({elementType: BeaconType, limit: 5}),
    },
});
