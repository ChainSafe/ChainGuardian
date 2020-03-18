import {PrivateKey} from "@chainsafe/bls/lib/privateKey";

import {BeaconChain, SupportedNetworks} from "../services/docker/chain";
import {DockerRegistry} from "../services/docker/docker-registry";
import {NetworkActionTypes} from "../constants/action-types";
import {Action, Dispatch} from "redux";
import {IRootState} from "../reducers";
import {BeaconNodes} from "../models/beaconNode";
import database from "../services/db/api/database";
import {PrysmBeaconClient} from "../services/eth2/client/prysm/prysm";
import {fromHex} from "../services/utils/bytes";

export interface ISaveSelectedNetworkAction {
    type: typeof NetworkActionTypes.SELECT_NETWORK;
    payload: string;
}
export const saveSelectedNetworkAction = (network: string): ISaveSelectedNetworkAction => ({
    type: NetworkActionTypes.SELECT_NETWORK,
    payload: network,
});

// Beacon chain

export const startBeaconChainAction = (network: string, ports?: string[]) => {
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

export const saveBeaconNodeAction = (url: string, network?: string) => {
    return async (dispatch: Dispatch<Action<unknown>>, getState: () => IRootState): Promise<void> => {
        const localDockerName = network ? BeaconChain.getContainerName(network) : undefined;
        const signingKey = PrivateKey.fromBytes(fromHex(getState().register.signingKey));
        const beaconNode = new BeaconNodes(url, localDockerName);
        const validatorAddress = signingKey.toPublicKey().toHexString();
        await database.beaconNodes.set(
            validatorAddress,
            beaconNode,
        );
    };
};

export interface IBeaconNodeStatus {
    isSyncing: boolean;
    currentSlot: string;
}
export const getBeaconNodeStatus = (url: string) => {
    return async (dispatch: Dispatch<Action<unknown>>, getState: () => IRootState): Promise<IBeaconNodeStatus> => {
        const currentNetwork = getState().network.selected;
        const beaconNode = PrysmBeaconClient.getPrysmBeaconClient(url, currentNetwork!);
        if (!beaconNode) {
            return {
                isSyncing: false,
                currentSlot: "0",
            };
        }

        const isSyncing = await beaconNode.isSyncing();
        const currentSlot = await beaconNode.getChainHeight();

        return {
            isSyncing,
            currentSlot,
        };
    };
};
