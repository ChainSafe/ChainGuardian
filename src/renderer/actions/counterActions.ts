import {Action, ActionCreator} from "redux";

export const INCREMENT = "INCREMENT";
export const DECREMENT = "DECREMENT";

export interface IncrementAction extends Action<string> {
    type: "INCREMENT";
}
export interface DecrementAction extends Action<string> {
    type: "DECREMENT";
}

export const increment: ActionCreator<IncrementAction> = () => ({
    type: INCREMENT
} as IncrementAction);

export const decrement: ActionCreator<DecrementAction> = () => ({
    type: DECREMENT
} as DecrementAction);

export type CounterAction = IncrementAction | DecrementAction;
