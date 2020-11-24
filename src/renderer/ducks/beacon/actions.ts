import {beaconSlice} from "./slice";
import {createAction} from "@reduxjs/toolkit";
import {StartBeaconChain} from "../network/types";
import {DockerPort} from "../../services/docker/type";
import {IConfigureBNSubmitOptions} from "../../components/ConfigureBeaconNode/ConfigureBeaconNode";

export const {addBeacons, addBeacon, removeBeacon} = beaconSlice.actions;

export const startLocalBeacon = createAction<IConfigureBNSubmitOptions>("beacon/startLocalBeacon");

export const linkBeaconToValidator = createAction<StartBeaconChain>(
    "beacon/linkBeaconToValidator",
    (network: string, ports?: DockerPort[]) => ({payload: {network, ports}}),
);
