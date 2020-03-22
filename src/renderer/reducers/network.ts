import {NetworkActionTypes} from "../constants/action-types";
import {ILoadedValidatorBeaconNodesAction, ISaveSelectedNetworkAction} from "../actions/network";
import {Action} from "redux";
import {IValidatorBeaconNodes} from "../models/beaconNode";

export interface INetworkState {
    selected?: string;
    validatorBeaconNodes: IValidatorBeaconNodes;
}

const initialState: INetworkState = {
    selected: undefined,
    validatorBeaconNodes: {},
};

export const networkReducer = (
    state = initialState,
    action: Action<NetworkActionTypes>): INetworkState => {
    switch (action.type) {
        case NetworkActionTypes.SELECT_NETWORK:
            return {...state, selected: (action as ISaveSelectedNetworkAction).payload};
        case NetworkActionTypes.LOADED_VALIDATOR_BEACON_NODES:
            const payload = (action as ILoadedValidatorBeaconNodesAction).payload;
            return {
                ...state,
                validatorBeaconNodes: {
                    ...state.validatorBeaconNodes,
                    [payload.validator]: payload.beaconNodes,
                }
            };
        default:
            return state;
    }
};
