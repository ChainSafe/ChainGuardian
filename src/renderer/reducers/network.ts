import {NetworkActionTypes} from "../constants/action-types";
import {ISaveSelectedNetworkAction} from "../actions/network";
import {Action} from "redux";

export interface INetworkState {
    selected?: string;
}

const initialState: INetworkState = {
    selected: undefined,
};

export const networkReducer = (
    state = initialState,
    action: Action<NetworkActionTypes>): INetworkState => {
    switch (action.type) {
        case NetworkActionTypes.SELECT_NETWORK:
            return {...state, selected: (action as ISaveSelectedNetworkAction).payload};
        default:
            return state;
    }
};
