import {ActionWithCallback} from "../../../../types/helpers";
import {beaconSlice} from "./slice";
import {createAction} from "@reduxjs/toolkit";
import {FinalizedEpoch, StartBeaconChain} from "../network/types";
import {DockerPort} from "../../services/docker/type";
import {IConfigureBNSubmitOptions} from "../../components/ConfigureBeaconNode/ConfigureBeaconNode";

export const {addBeacons, addBeacon, removeBeacon, updateSlot} = beaconSlice.actions;

export const startLocalBeacon = createAction<ActionWithCallback<IConfigureBNSubmitOptions>>(
    "beacon/startLocalBeacon",
    (payload: IConfigureBNSubmitOptions, onComplete: () => void) => ({payload, meta: {onComplete}}),
);

export const linkBeaconToValidator = createAction<StartBeaconChain>(
    "beacon/linkBeaconToValidator",
    (network: string, ports?: DockerPort[]) => ({payload: {network, ports}}),
);

export const finalizedEpoch = createAction<FinalizedEpoch>(
    "beacon/finalizedEpoch",
    (beacon: string, epoch: number) => ({payload: {beacon, epoch}}),
);
