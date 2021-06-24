import {IDefaultBeaconNodeConfig, IDefaultValidatorConfig} from "../defaults";

export const beaconNode: IDefaultBeaconNodeConfig = {
    rpcPort: 5052,
    libp2pPort: 9000,
    discoveryPort: 9000,
    memory: "3500m",
    owner: "ConsenSys",
    repo: "teku",
    versionPrefix: "",
    dockerImage: process.env.DOCKER_TEKU_IMAGE,
};

export const validator: IDefaultValidatorConfig = {};
