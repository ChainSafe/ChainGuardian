import {ActionWithCallback} from "../../../../types/helpers";
import {beaconSlice} from "./slice";
import {createAction} from "@reduxjs/toolkit";
import {StartBeaconChain} from "../network/types";
import {DockerPort} from "../../services/docker/type";
import {IConfigureBNSubmitOptions} from "../../components/ConfigureBeaconNode/ConfigureBeaconNode";

export const {addBeacons, addBeacon, removeBeacon, updateSlot, updateStatus, updateVersion} = beaconSlice.actions;

export const startLocalBeacon = createAction<ActionWithCallback<IConfigureBNSubmitOptions>>(
    "beacon/startLocalBeacon",
    (payload: IConfigureBNSubmitOptions, onComplete: () => void) => ({payload, meta: {onComplete}}),
);

export const linkBeaconToValidator = createAction<StartBeaconChain>(
    "beacon/linkBeaconToValidator",
    (network: string, ports?: DockerPort[]) => ({payload: {network, ports}}),
);

export type UpdateEpoch = (
    epoch: number,
    publicKey: string,
) => {
    payload: number;
    meta: string;
};
export const updateEpoch = createAction<UpdateEpoch>("beacon/updateEpoch", (epoch: number, publicKey: string) => ({
    payload: epoch,
    meta: publicKey,
}));
