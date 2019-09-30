import {Action, ActionCreator} from "redux";

export const INCREMENT = "INCREMENT";
export const DECREMENT = "DECREMENT";

export interface IIncrementAction extends Action<string> {
    type: "INCREMENT";
}
export interface IDecrementAction extends Action<string> {
    type: "DECREMENT";
}

export const increment: ActionCreator<IIncrementAction> = () => ({
    type: INCREMENT
} as IIncrementAction);

export const decrement: ActionCreator<IDecrementAction> = () => ({
    type: DECREMENT
} as IDecrementAction);

export type CounterAction = IIncrementAction | IDecrementAction;
