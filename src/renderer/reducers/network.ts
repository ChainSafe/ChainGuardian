import {IValidatorBeaconNodes} from "../models/beaconNode";
import {NetworkAction, NetworkActionTypes} from "../actions/network";

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

export const networkReducer = (
    state = initialState,
    action: NetworkAction): INetworkState => {
    let payload;
    switch (action.type) {
        case NetworkActionTypes.SELECT_NETWORK:
            payload = action.payload;
            return {...state, selected: payload === "All networks" ? undefined : payload};

        case NetworkActionTypes.LOADED_VALIDATOR_BEACON_NODES:
            payload = action.payload;
            return {
                ...state,
                validatorBeaconNodes: {
                    ...state.validatorBeaconNodes,
                    [payload.validator]: payload.beaconNodes,
                }
            };

        case NetworkActionTypes.SUBSCRIBE_TO_BLOCK_LISTENING:
            payload = action.payload;
            return {
                ...state,
                blockSubscriptions: {
                    ...state.blockSubscriptions,
                    [payload.validator]: payload.timeoutId,
                }
            };

        case NetworkActionTypes.UNSUBSCRIBE_TO_BLOCK_LISTENING:
            payload = action.payload;
            if (state.blockSubscriptions[payload.validator]) {
                clearInterval(state.blockSubscriptions[payload.validator]);
                delete state.blockSubscriptions[payload.validator];
            }
            return state;

        case NetworkActionTypes.START_DOCKER_IMAGE_PULL:
            return {
                ...state,
                pullingDockerImage: true,
            };

        case NetworkActionTypes.END_DOCKER_IMAGE_PULL:
            return {
                ...state,
                pullingDockerImage: false,
                finishedPullingDockerImage: true,
            };

        default:
            return state;
    }
};
