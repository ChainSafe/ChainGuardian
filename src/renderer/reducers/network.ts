import {NetworkActionTypes} from "../constants/action-types";
import {ISaveSelectedNetworkAction} from "../actions/network";

export interface INetworkState {
    network?: string;
}

const initialState: INetworkState = {
    network: undefined,
};

export const networkReducer = (
    state = initialState,
    action: ISaveSelectedNetworkAction): INetworkState => {

    switch (action.type) {
        case NetworkActionTypes.SELECT_NETWORK:
            return {...state, network: action.payload};
        default:
            return state;
    }
};
