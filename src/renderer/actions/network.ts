import {PrivateKey} from "@chainsafe/bls";
import {warn} from "electron-log";
import {Action, Dispatch} from "redux";
import * as logger from "electron-log";

import {BeaconChain} from "../services/docker/chain";
import {NetworkActionTypes} from "../constants/action-types";
import {IRootState} from "../reducers";
import {BeaconNode, BeaconNodes} from "../models/beaconNode";
import database from "../services/db/api/database";
import {DockerPort} from "../services/docker/type";
import {getNetworkConfig} from "../services/eth2/networks";
import {SupportedNetworks} from "../services/eth2/supportedNetworks";
import {fromHex} from "../services/utils/bytes";
import {IEth2ChainHead} from "../models/types/head";

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
export interface IDockerImagePull {
    type: typeof NetworkActionTypes.START_DOCKER_IMAGE_PULL |
        typeof NetworkActionTypes.END_DOCKER_IMAGE_PULL;
}

const startImagePulling = (): IDockerImagePull => ({
    type: NetworkActionTypes.START_DOCKER_IMAGE_PULL,
});

const endImagePulling = (): IDockerImagePull => ({
    type: NetworkActionTypes.END_DOCKER_IMAGE_PULL,
});

export const startBeaconChainAction = (network: string, ports?: DockerPort[]) => {
    return async (dispatch: Dispatch<Action<unknown>>, getState: () => IRootState): Promise<void> => {
        // Pull image first
        const image = getNetworkConfig(network).dockerConfig.image;
        dispatch(startImagePulling());
        await BeaconChain.pullImage(image);
        dispatch(endImagePulling());

        // Start chain
        switch(network) {
            default:
                await BeaconChain.startBeaconChain(SupportedNetworks.LOCALHOST, ports);
        }

        // Save local beacon node to db
        saveBeaconNodeAction(`http://localhost:${ports[1].local}`, network)(dispatch, getState);
    };
};

export const saveBeaconNodeAction = (url: string, network?: string, validatorKey?: string) => {
    return async (dispatch: Dispatch<Action<unknown>>, getState: () => IRootState): Promise<void> => {
        const localDockerName = network ? BeaconChain.getContainerName(network) : null;
        let validatorAddress = validatorKey || "";
        if (validatorAddress === "") {
            const signingKey = PrivateKey.fromBytes(fromHex(getState().register.signingKey));
            validatorAddress = signingKey.toPublicKey().toHexString();
        }
        const beaconNode = new BeaconNodes();
        beaconNode.addNode(url, localDockerName);
        await database.beaconNodes.upsert(
            validatorAddress,
            beaconNode,
        );
    };
};

export const removeBeaconNodeAction = (image: string, validator: string) => {
    return async (dispatch: Dispatch<Action<unknown>>): Promise<void> => {
        const validatorBeaconNodes = await database.beaconNodes.get(validator);
        const newBeaconNodesList = BeaconNodes.createNodes(validatorBeaconNodes.nodes);
        newBeaconNodesList.removeNode(image);
        await database.beaconNodes.set(
            validator,
            newBeaconNodesList,
        );

        dispatch(storeValidatorBeaconNodes(validator, newBeaconNodesList.nodes));
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

export const loadValidatorBeaconNodes = (validator: string, subscribe = false) => {
    return async (dispatch: Dispatch<Action<unknown>>, getState: () => IRootState): Promise<void> => {
        const validatorBeaconNodes = await getState().auth.account!.getValidatorBeaconNodes(validator);
        logger.info(`Found ${validatorBeaconNodes.length} beacon nodes for validator ${validator}.`);
        await Promise.all(validatorBeaconNodes.map(async(validatorBN) => {
            if (validatorBN.client) {
                try {
                    // Load data once initially
                    const chainHead = await validatorBN.client.beacon.getChainHead();
                    const refreshFnWithContext = refreshBeaconNodeStatus.bind(null, dispatch, getState, validator);
                    await refreshFnWithContext(chainHead);

                    if (subscribe) {
                        const existingTimeout = getState().network.blockSubscriptions[validator];
                        if (!existingTimeout) {
                            const timeoutId = validatorBN.client.onNewChainHead(refreshFnWithContext);
                            dispatch(subscribeToBlockListening(validator, timeoutId));
                        }
                    }
                } catch (e) {
                    dispatch(storeValidatorBeaconNodes(validator, validatorBeaconNodes));
                    warn("Error while fetching chainhead from beacon node... ", e.message);
                }
            }
        }));
    };
};

async function refreshBeaconNodeStatus(
    dispatch: Dispatch<Action<unknown>>,
    getState: () => IRootState,
    validator: string,
    chainHead: IEth2ChainHead,
): Promise<void> {
    const validatorBeaconNodes = await getState().auth.account!.getValidatorBeaconNodes(validator);
    const beaconNodes: BeaconNode[] = await Promise.all(validatorBeaconNodes.map(async(validatorBN: BeaconNode) => {
        try {
            if (!validatorBN.client) {
                throw new Error("No ETH2 API client");
            }
            return {
                ...validatorBN,
                isSyncing: (await validatorBN.client.node.getSyncingStatus()).syncDistance === BigInt(0),
                currentSlot: String(chainHead.slot),
            };
        } catch (e) {
            warn(`Error while trying to fetch beacon node status... ${e.message}`);
            return validatorBN;
        }
    }));
    dispatch(storeValidatorBeaconNodes(validator, beaconNodes));
}

const storeValidatorBeaconNodes = (
    validator: string,
    beaconNodes: BeaconNode[],
): ILoadedValidatorBeaconNodesAction => ({
    type: NetworkActionTypes.LOADED_VALIDATOR_BEACON_NODES,
    payload: {
        validator,
        beaconNodes,
    },
});

// Block subscription related
export interface ISubscribeToBlockListeningAction {
    type: typeof NetworkActionTypes.SUBSCRIBE_TO_BLOCK_LISTENING;
    payload: {
        validator: string;
        timeoutId: NodeJS.Timeout;
    };
}

const subscribeToBlockListening = (
    validator: string,
    timeoutId: NodeJS.Timeout,
): ISubscribeToBlockListeningAction => ({
    type: NetworkActionTypes.SUBSCRIBE_TO_BLOCK_LISTENING,
    payload: {
        validator,
        timeoutId,
    }
});

export interface IUnsubscribeToBlockListeningAction {
    type: typeof NetworkActionTypes.UNSUBSCRIBE_TO_BLOCK_LISTENING;
    payload: {
        validator: string;
    };
}

export const unsubscribeToBlockListening = (validator: string): IUnsubscribeToBlockListeningAction => ({
    type: NetworkActionTypes.UNSUBSCRIBE_TO_BLOCK_LISTENING,
    payload: {
        validator,
    }
});
