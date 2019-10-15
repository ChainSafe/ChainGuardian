import {Reducer} from "redux";
import {CounterAction, DECREMENT, INCREMENT} from "../actions/counterActions";

export interface ICounterState {
    readonly value: number;
}

const defaultState: ICounterState = {
    value: 0
};

export const counterReducer: Reducer<ICounterState> = (
    state = defaultState,
    action: CounterAction
) => {
    switch (action.type) {
        case INCREMENT:
            return {
                ...state,
                value: state.value + 1
            };
        case DECREMENT:
            return {
                ...state,
                value: state.value - 1
            };
        default:
            return state;
    }
};
