import {ContainerType, ListType} from "@chainsafe/ssz";
import {StringType} from "./basic";
import {Beacon, Beacons, DockerConfig} from "../beacons";

export const DockerConfigType = new ContainerType<DockerConfig>({
    fields: {
        id: new StringType(),
        network: new StringType(),
        chainDataDir: new StringType(),
        eth1Url: new StringType(),
        discoveryPort: new StringType(),
        libp2pPort: new StringType(),
        rpcPort: new StringType(),
    },
});

export const BeaconType = new ContainerType<Beacon>({
    fields: {
        url: new StringType(),
        docker: DockerConfigType,
    },
});

export const BeaconsType = new ContainerType<Beacons>({
    fields: {
        beacons: new ListType({elementType: BeaconType, limit: 5}),
    },
});
