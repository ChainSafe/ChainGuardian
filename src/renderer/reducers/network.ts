import {NetworkActionTypes} from "../constants/action-types";
import {
    ILoadedValidatorBeaconNodesAction,
    ISaveSelectedNetworkAction,
    ISubscribeToBlockListeningAction, IUnsubscribeToBlockListeningAction
} from "../actions/network";
import {Action} from "redux";
import {IValidatorBeaconNodes} from "../models/beaconNode";

type BlockSubscriptions = {
    [key: string]: NodeJS.Timeout,
};

export interface INetworkState {
    selected?: string;
    validatorBeaconNodes: IValidatorBeaconNodes;
    blockSubscriptions: BlockSubscriptions;
}

const initialState: INetworkState = {
    selected: undefined,
    validatorBeaconNodes: {},
    blockSubscriptions: {},
};

export const networkReducer = (
    state = initialState,
    action: Action<NetworkActionTypes>): INetworkState => {
    let payload;
    switch (action.type) {
        case NetworkActionTypes.SELECT_NETWORK:
            payload = (action as ISaveSelectedNetworkAction).payload;
            return {...state, selected: payload === "All networks" ? undefined : payload};
        case NetworkActionTypes.LOADED_VALIDATOR_BEACON_NODES:
            payload = (action as ILoadedValidatorBeaconNodesAction).payload;
            return {
                ...state,
                validatorBeaconNodes: {
                    ...state.validatorBeaconNodes,
                    [payload.validator]: payload.beaconNodes,
                }
            };
        case NetworkActionTypes.SUBSCRIBE_TO_BLOCK_LISTENING:
            payload = (action as ISubscribeToBlockListeningAction).payload;
            return {
                ...state,
                blockSubscriptions: {
                    ...state.blockSubscriptions,
                    [payload.validator]: payload.timeoutId,
                }
            };

        case NetworkActionTypes.UNSUBSCRIBE_TO_BLOCK_LISTENING:
            payload = (action as IUnsubscribeToBlockListeningAction).payload;
            if (state.blockSubscriptions[payload.validator]) {
                clearInterval(state.blockSubscriptions[payload.validator]);
                delete state.blockSubscriptions[payload.validator];
            }
            return state;

        default:
            return state;
    }
};
