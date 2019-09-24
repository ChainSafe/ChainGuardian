import { Reducer, Action } from 'redux';
import { SET_NODE_VERSION, RestClientAction } from '../actions/restClientActions';

export interface NodeState {
    readonly version: string;
}

const defaultState: NodeState = {
    version: ''
};

export const restClientReducer: Reducer<NodeState> = (state = defaultState, incomingAction: Action) => {
    const action = incomingAction as RestClientAction;
    switch (action.type) {
        case SET_NODE_VERSION:
            return {
                ...state,
                version: action.version
            };
        default:
            return state;
    }
};
