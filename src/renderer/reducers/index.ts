import { combineReducers } from 'redux';

import { CounterState, counterReducer } from './counterReducer';
import { NodeState, restClientReducer } from './restClientReducer';

export interface RootState {
    counter: CounterState;
    node: NodeState;
}

export const rootReducer = combineReducers<RootState | undefined>({
    counter: counterReducer,
    node: restClientReducer
});
