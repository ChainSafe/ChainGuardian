import {beaconSlice} from "./slice";
import {createAction} from "@reduxjs/toolkit";
import {StartBeaconChain} from "../network/types";
import {DockerPort} from "../../services/docker/type";

export const {addBeacons, addBeacon, removeBeacon} = beaconSlice.actions;

export const startLocalBeacon = createAction<StartBeaconChain>(
    "beacon/startLocalBeacon",
    (network: string, ports?: DockerPort[]) => ({payload: {network, ports}}),
);

export const linkBeaconToValidator = createAction<StartBeaconChain>(
    "beacon/linkBeaconToValidator",
    (network: string, ports?: DockerPort[]) => ({payload: {network, ports}}),
);
