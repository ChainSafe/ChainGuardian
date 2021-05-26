import {IDefaultBeaconNodeConfig, IDefaultValidatorConfig} from "../defaults";

export const beaconNode: IDefaultBeaconNodeConfig = {
    rpcPort: 5052,
    libp2pPort: 9000,
    discoveryPort: 9000,
    memory: "3500m",
    owner: "statusim",
    repo: "nimbus-eth2",
    dockerImage: process.env.DOCKER_NIMBUS_IMAGE,
};

export const validator: IDefaultValidatorConfig = {};
