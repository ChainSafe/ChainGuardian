import {PrivateKey} from "@chainsafe/bls/lib/privateKey";

import {BeaconChain, SupportedNetworks} from "../services/docker/chain";
import {DockerRegistry} from "../services/docker/docker-registry";
import { AuthActionTypes, NetworkActionTypes } from '../constants/action-types';
import {Action, Dispatch} from "redux";
import {IRootState} from "../reducers";
import {BeaconNode} from "../models/beaconNode";
import database from "../services/db/api/database";
import { CGAccount } from '../models/account';

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

export interface ISaveSelectedNetworkAction {
    type: typeof NetworkActionTypes.SELECT_NETWORK;
    payload: string;
}
export const saveSelectedNetworkAction = (network: string): ISaveSelectedNetworkAction => ({
    type: NetworkActionTypes.SELECT_NETWORK,
    payload: network,
});

export const saveBeaconNodeAction = (url: string) => {
    return async (dispatch: Dispatch<Action<unknown>>, getState: () => IRootState): Promise<void> => {
        const signingKey = PrivateKey.fromBytes(
            Buffer.from(getState().register.signingKey.replace("0x",""), "hex")
        );
        const beaconNode = new BeaconNode(url);
        const validatorAddress = signingKey.toPublicKey().toHexString();
        await database.beaconNodes.set(
            validatorAddress,
            beaconNode,
        );
    };
};

export const loadedBeaconNode = (node: BeaconNode | null, validatorAddress: string): ILoadBeaconNodeAction => ({
    type: NetworkActionTypes.LOAD_BEACON_NODE,
    payload: {
        beaconNode: node,
        validatorAddress,
    },
});

export const loadBeaconNodesAction = (validatorAddress: string) => {
    return async (dispatch: Dispatch<Action<unknown>>): Promise<void> => {
        const node = await database.beaconNodes.get(validatorAddress);
        dispatch(loadedBeaconNode(node, validatorAddress));
    };
};

export interface IBeaconNodePayload {
    beaconNode: BeaconNode | null;
    validatorAddress: string;
}
export interface ILoadBeaconNodeAction extends Action<NetworkActionTypes> {
    payload: IBeaconNodePayload;
}

