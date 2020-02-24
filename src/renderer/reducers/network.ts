import {NetworkActionTypes} from "../constants/action-types";
import {IBeaconNodePayload, ILoadBeaconNodeAction, ISaveSelectedNetworkAction} from "../actions/network";
import {Action} from "redux";

export interface INetworkState {
    selected?: string;
    beaconNodes: IBeaconNodePayload[];
}

const initialState: INetworkState = {
    selected: undefined,
    beaconNodes: [],
};

export const networkReducer = (
    state = initialState,
    action: Action<NetworkActionTypes>): INetworkState => {
    const nodes = state.beaconNodes;

    switch (action.type) {
        case NetworkActionTypes.SELECT_NETWORK:
            return {...state, selected: (action as ISaveSelectedNetworkAction).payload};
        case NetworkActionTypes.LOAD_BEACON_NODE:
            nodes.push((action as ILoadBeaconNodeAction).payload);
            return {...state, beaconNodes: nodes};
        default:
            return state;
    }
};
