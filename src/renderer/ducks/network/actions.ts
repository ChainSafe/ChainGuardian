import {
    DockerImageAction,
    LoadedValidatorBeaconNodesAction,
    NetworkAction,
    NetworkActionTypes,
    SaveSelectedNetworkAction,
    SubscribeToBlockListeningAction,
    UnsubscribeToBlockListeningAction
} from "./types";
import {DockerPort} from "../../services/docker/type";
import {Dispatch} from "redux";
import {IRootState} from "../../reducers";
import {getNetworkConfig} from "../../services/eth2/networks";
import {BeaconChain} from "../../services/docker/chain";
import {SupportedNetworks} from "../../services/eth2/supportedNetworks";
import {PrivateKey} from "@chainsafe/bls";
import {fromHex} from "../../services/utils/bytes";
import {BeaconNode, BeaconNodes} from "../../models/beaconNode";
import database from "../../services/db/api/database";
import * as logger from "electron-log";
import {warn} from "electron-log";
import {IEth2ChainHead} from "../../models/types/head";

export * from "./types";

// User selected network in dashboard dropdown
export const saveSelectedNetworkAction = (network: string): SaveSelectedNetworkAction => ({
    type: NetworkActionTypes.SELECT_NETWORK,
    payload: network,
});

const startImagePulling = (): DockerImageAction => ({
    type: NetworkActionTypes.START_DOCKER_IMAGE_PULL,
});

const endImagePulling = (): DockerImageAction => ({
    type: NetworkActionTypes.END_DOCKER_IMAGE_PULL,
});

export const startBeaconChainAction = (network: string, ports?: DockerPort[]) => {
    return async (dispatch: Dispatch<NetworkAction>, getState: () => IRootState): Promise<void> => {
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
        await saveBeaconNodeAction(`http://localhost:${ports[1].local}`, network)(dispatch, getState);
    };
};

export const saveBeaconNodeAction = (url: string, network?: string, validatorKey?: string) => {
    return async (dispatch: Dispatch<NetworkAction>, getState: () => IRootState): Promise<void> => {
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
    return async (dispatch: Dispatch<LoadedValidatorBeaconNodesAction>): Promise<void> => {
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

export const loadValidatorBeaconNodes = (validator: string, subscribe = false) => {
    return async (dispatch: Dispatch<NetworkAction>, getState: () => IRootState): Promise<void> => {
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
    dispatch: Dispatch<LoadedValidatorBeaconNodesAction>,
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
): LoadedValidatorBeaconNodesAction => ({
    type: NetworkActionTypes.LOADED_VALIDATOR_BEACON_NODES,
    payload: {
        validator,
        beaconNodes,
    },
});

// Block subscription related


const subscribeToBlockListening = (
    validator: string,
    timeoutId: NodeJS.Timeout,
): SubscribeToBlockListeningAction => ({
    type: NetworkActionTypes.SUBSCRIBE_TO_BLOCK_LISTENING,
    payload: {
        validator,
        timeoutId,
    }
});


export const unsubscribeToBlockListening = (validator: string): UnsubscribeToBlockListeningAction => ({
    type: NetworkActionTypes.UNSUBSCRIBE_TO_BLOCK_LISTENING,
    payload: {
        validator,
    }
});

import {BeaconNode} from "../../models/beaconNode";

export enum NetworkActionTypes {
    SELECT_NETWORK = "SELECT_NETWORK",
    START_DOCKER_IMAGE_PULL = "START_DOCKER_IMAGE_PULL",
    END_DOCKER_IMAGE_PULL = "END_DOCKER_IMAGE_PULL",
    LOADED_VALIDATOR_BEACON_NODES = "LOADED_VALIDATOR_BEACON_NODES",
    SUBSCRIBE_TO_BLOCK_LISTENING = "SUBSCRIBE_TO_BLOCK_LISTENING",
    UNSUBSCRIBE_TO_BLOCK_LISTENING = "UNSUBSCRIBE_TO_BLOCK_LISTENING"
}

export type SaveSelectedNetworkAction = {
    type: typeof NetworkActionTypes.SELECT_NETWORK;
    payload: string;
};

export type DockerImageAction = {
    type: typeof NetworkActionTypes.START_DOCKER_IMAGE_PULL | typeof NetworkActionTypes.END_DOCKER_IMAGE_PULL;
};

export type UnsubscribeToBlockListeningAction = {
    type: typeof NetworkActionTypes.UNSUBSCRIBE_TO_BLOCK_LISTENING;
    payload: {
        validator: string;
    };
};

export type SubscribeToBlockListeningAction = {
    type: typeof NetworkActionTypes.SUBSCRIBE_TO_BLOCK_LISTENING;
    payload: {
        validator: string;
        timeoutId: NodeJS.Timeout;
    };
};


export type LoadedValidatorBeaconNodesAction = {
    type: typeof NetworkActionTypes.LOADED_VALIDATOR_BEACON_NODES;
    payload: {
        validator: string;
        beaconNodes: BeaconNode[];
    };
};

export type NetworkAction =
    SaveSelectedNetworkAction
    | DockerImageAction
    | LoadedValidatorBeaconNodesAction
    | UnsubscribeToBlockListeningAction
    | SubscribeToBlockListeningAction;


