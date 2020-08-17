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
