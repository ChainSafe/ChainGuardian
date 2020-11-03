import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {BeaconNode, IValidatorBeaconNodes} from "../../models/beaconNode";

type BlockSubscriptions = {
    [key: string]: NodeJS.Timeout,
};

export interface INetworkState {
    selected?: string;
    validatorBeaconNodes: IValidatorBeaconNodes;
    blockSubscriptions: BlockSubscriptions;
    pullingDockerImage: boolean;
    finishedPullingDockerImage: boolean;
}

const initialState: INetworkState = {
    selected: undefined,
    validatorBeaconNodes: {},
    blockSubscriptions: {},
    pullingDockerImage: false,
    finishedPullingDockerImage: false,
};

export const networkSlice = createSlice({
    name: "network",
    initialState,
    reducers: {
        loadedValidatorBeaconNodes: {
            reducer: (state, action: PayloadAction<BeaconNode[], string, string>): void =>
            {
                state.validatorBeaconNodes[action.meta] = action.payload;
            },
            prepare: (beaconNodes: BeaconNode[], validator: string): { payload: BeaconNode[]; meta: string } => ({
                payload: beaconNodes, meta: validator,
            }),
        },
        subscribeToBlockListening: {
            reducer: (state, action: PayloadAction<NodeJS.Timeout, string, string>): void => {
                state.blockSubscriptions[action.meta] = action.payload;
            },
            prepare: (timeoutId: NodeJS.Timeout, validator: string): { payload: NodeJS.Timeout; meta: string } => ({
                payload: timeoutId, meta: validator,
            }),
        },
        selectNetwork: (state, action: PayloadAction<string>): void => {
            state.selected = action.payload === "All networks" ? undefined : action.payload;
        },
        unsubscribeToBlockListening: (state, action: PayloadAction<string>): void => {
            if (state.blockSubscriptions[action.payload]) {
                clearInterval(state.blockSubscriptions[action.payload]);
                delete state.blockSubscriptions[action.payload];
            }
        },
        startDockerImagePull: (state): void => {
            state.pullingDockerImage = true;
        },
        endDockerImagePull: (state): void => {
            state.pullingDockerImage = false;
            state.finishedPullingDockerImage = true;
        },
    },
});
