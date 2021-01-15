import {networkSlice} from "./slice";
import {createAction} from "@reduxjs/toolkit";
import {RemoveBeaconNode, SaveBeaconNode} from "./types";

export const {
    startDockerImagePull,
    endDockerImagePull,
    selectNetwork,
    loadedValidatorBeaconNodes,
    subscribeToBlockListening,
    unsubscribeToBlockListening,
    setDockerDemonIsOffline,
} = networkSlice.actions;

export const cancelDockerPull = createAction("network/cancelDockerPull");

export const saveBeaconNode = createAction<SaveBeaconNode>(
    "network/saveBeaconNode",
    (url: string, network?: string, validatorKey?: string) => ({payload: {url, network, validatorKey}}),
);

export const removeBeaconNode = createAction<RemoveBeaconNode>(
    "network/removeBeaconNode",
    (image: string, validator: string) => ({payload: {image, validator}}),
);

export const checkDockerDemonIsOnline = createAction("network/recheckDockerDemonIsOnline");
