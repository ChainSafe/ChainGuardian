import {BeaconChain, SupportedNetworks} from "../services/docker/chain";

export const startBeaconChainAction = (network = SupportedNetworks.PRYSM) => {
    return async (): Promise<void> => {
        switch(network) {
            case SupportedNetworks.PRYSM:
                 await BeaconChain.startPrysmBeaconChain();
                break;
            default:
                await BeaconChain.startPrysmBeaconChain();
        }
    };
};

export const stopBeaconChainAction = () => {
    return async (): Promise<void> => {
        await BeaconChain.instance.stop();
    };
};

export const restartBeaconChainAction = () => {
    return async (): Promise<void> => {
        await BeaconChain.instance.restart();
    };
};
