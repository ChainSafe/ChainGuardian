import {networkSlice} from "./slice";
import {createAction} from "@reduxjs/toolkit";
import {DockerPort} from "../../services/docker/type";

export const {
    startDockerImagePull, endDockerImagePull,
    selectNetwork, loadedValidatorBeaconNodes,
    subscribeToBlockListening, unsubscribeToBlockListening
} = networkSlice.actions;

type StartBeaconChain = (network: string, ports?: DockerPort[]) => {payload: {network: string, ports?: DockerPort[]}};
export const startBeaconChain = createAction<StartBeaconChain>(
    "network/startBeaconChain", (network: string, ports?: DockerPort[]) => ({payload: {network, ports}})
);

type SaveBeaconNode = (url: string, network?: string, validatorKey?: string) =>
{payload: {url: string, network?: string, validatorKey?: string}};
export const saveBeaconNode = createAction<SaveBeaconNode>(
    "network/startBeaconChain",
    (url: string, network?: string, validatorKey?: string) => ({payload: {url, network, validatorKey}})
);

type RemoveBeaconNode = (image: string, validator: string) => {payload: {image: string, validator: string}};
export const removeBeaconNode = createAction<RemoveBeaconNode>(
    "network/removeBeaconNode", (image: string, validator: string) => ({payload: {image, validator}})
);

type LoadValidatorBeaconNodes = (validator: string, subscribe?: boolean) =>
{payload: {validator: string, subscribe: boolean}};
export const loadValidatorBeaconNodes = createAction<LoadValidatorBeaconNodes>(
    "network/loadValidatorBeaconNodes", (validator: string, subscribe = false) => ({payload: {validator, subscribe}})
);
