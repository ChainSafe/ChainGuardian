import {NetworkActionTypes} from "../constants/action-types";
import {ISaveSelectedNetworkAction} from "../actions/network";

export interface INetworkState {
    selected?: string;
}

const initialState: INetworkState = {
    selected: undefined,
};

export const networkReducer = (
    state = initialState,
    action: ISaveSelectedNetworkAction): INetworkState => {

    switch (action.type) {
        case NetworkActionTypes.SELECT_NETWORK:
            return {...state, selected: action.payload};
        default:
            return state;
    }
};
