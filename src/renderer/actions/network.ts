import {PrivateKey} from "@chainsafe/bls/lib/privateKey";
import {Action, Dispatch} from "redux";

import {BeaconChain} from "../services/docker/chain";
import {DockerRegistry} from "../services/docker/docker-registry";
import {NetworkActionTypes} from "../constants/action-types";
import {IRootState} from "../reducers";
import {BeaconNode, BeaconNodes} from "../models/beaconNode";
import database from "../services/db/api/database";
import {SupportedNetworks} from "../services/eth2/supportedNetworks";
import {fromHex} from "../services/utils/bytes";

// User selected network in dashboard dropdown
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

// Loading validator beacon nodes

export interface ILoadedValidatorBeaconNodesAction {
    type: typeof NetworkActionTypes.LOADED_VALIDATOR_BEACON_NODES;
    payload: {
        validator: string;
        beaconNodes: BeaconNode[];
    };
}

export interface IBeaconNodeStatus {
    isSyncing: boolean;
    currentSlot: string;
}
export const loadValidatorBeaconNodes = (validator: string) => {
    return async (dispatch: Dispatch<Action<unknown>>, getState: () => IRootState): Promise<void> => {
        const beaconNodes = await getState().auth.account!.getValidatorBeaconNodes(validator);
        dispatch({
            type: NetworkActionTypes.LOADED_VALIDATOR_BEACON_NODES,
            payload: {
                validator,
                beaconNodes,
            },
        });
    };
};
