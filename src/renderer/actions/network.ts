import {BeaconChain, SupportedNetworks} from "../services/docker/chain";
import { DockerRegistry } from '../services/docker/docker-registry';

export const startBeaconChainAction = (network = SupportedNetworks.PRYSM, ports?: string[]) => {
    return async (): Promise<void> => {
        switch(network) {
            case SupportedNetworks.PRYSM:
                await BeaconChain.startPrysmBeaconChain(ports);
                break;
            default:
                await BeaconChain.startPrysmBeaconChain(ports);
        }
    };
};

export const stopBeaconChainAction = (network = SupportedNetworks.PRYSM) => {
    return async (): Promise<void> => {
        const container = DockerRegistry.getContainer(network);
        if (container) {
            await container.stop();
        }
    };
};

export const restartBeaconChainAction = (network = SupportedNetworks.PRYSM) => {
    return async (): Promise<void> => {
        const container = DockerRegistry.getContainer(network);
        if (container) {
            await container.restart();
        }
    };
};
