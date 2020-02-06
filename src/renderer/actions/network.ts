import { BeaconChain, SupportedNetworks } from '../services/docker/chain';

export const startBeaconChainAction = (network = SupportedNetworks.PRYSM) => {
    return async (): Promise<void> => {
        let beaconChain;
        switch(network) {
            case SupportedNetworks.PRYSM:
                beaconChain = await BeaconChain.startPrysmBeaconChain();
                break;
            default:
                beaconChain = await BeaconChain.startPrysmBeaconChain();
        }
    }
};

export const stopBeaconChainAction = () => {
    return async (): Promise<void> => {
        await BeaconChain.instance.stop();
    }
};

export const restartBeaconChainAction = () => {
    return async (): Promise<void> => {
        await BeaconChain.instance.restart();
    }
};
