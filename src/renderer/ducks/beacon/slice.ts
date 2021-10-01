import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {DockerConfig} from "../../models/beacons";

export enum BeaconStatus {
    active,
    starting,
    syncing,
    offline,
}

export type Beacon = {
    url: string;
    status: BeaconStatus;
    network: string;
    version?: string;
    slot: number;
    docker?: DockerConfig;
};

export interface IBeaconDictionary {
    [key: string]: Beacon;
}

export interface IBeaconState {
    beacons: IBeaconDictionary;
    keys: string[];
}

const initialState: IBeaconState = {
    beacons: {},
    keys: [],
};

export const beaconSlice = createSlice({
    name: "beacon",
    initialState,
    reducers: {
        addBeacons: (state, action: PayloadAction<Beacon[]>): void => {
            action.payload.forEach((beacon) => {
                state.beacons[beacon.url] = beacon;
                if (!state.keys.some((key) => key === beacon.url)) {
                    state.keys.push(beacon.url);
                }
            });
        },
        addBeacon: {
            reducer: (state, action: PayloadAction<Beacon>): void => {
                state.beacons[action.payload.url] = action.payload;
                if (!state.keys.some((key) => key === action.payload.url)) {
                    state.keys.push(action.payload.url);
                }
            },
            prepare: (url: string, network: string, docker?: DockerConfig): {payload: Beacon} => ({
                payload: {url, network, docker, status: BeaconStatus.starting, slot: 0},
            }),
        },
        updateSlot: {
            reducer: (state, action: PayloadAction<number, string, string>): void => {
                state.beacons[action.meta].slot = action.payload;
            },
            prepare: (slotHeight: number, url: string): {payload: number; meta: string} => ({
                payload: slotHeight,
                meta: url,
            }),
        },
        updateStatus: {
            reducer: (state, action: PayloadAction<BeaconStatus, string, string>): void => {
                state.beacons[action.meta].status = action.payload;
            },
            prepare: (status: BeaconStatus, url: string): {payload: number; meta: string} => ({
                payload: status,
                meta: url,
            }),
        },
        updateVersion: {
            reducer: (state, action: PayloadAction<string, string, string>): void => {
                state.beacons[action.meta].version = action.payload;
            },
            prepare: (version: string, url: string): {payload: string; meta: string} => ({
                payload: version,
                meta: url,
            }),
        },
        removeBeacon: (state, action: PayloadAction<string>): void => {
            delete state.beacons[action.payload];
            const index = state.keys.findIndex((key) => key === action.payload);
            if (index !== -1) {
                state.keys.splice(index, 1);
            }
        },
    },
});
