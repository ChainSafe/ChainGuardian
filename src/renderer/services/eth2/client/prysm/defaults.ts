import {IDefaultBeaconNodeConfig, IDefaultValidatorConfig} from "../defaults";

export const beaconNode: IDefaultBeaconNodeConfig = {
    rpcPort: 5052,
    libp2pPort: 9000,
    discoveryPort: 9000,
    memory: "3500m",
    versionPrefix: "",
    dockerImage: process.env.DOCKER_PRYSM_IMAGE,
    owner: "prysmaticlabs",
    repo: "prysm",
};

export const validator: IDefaultValidatorConfig = {};
