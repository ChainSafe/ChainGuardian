import {IBeforeQuitAction} from "../actions";
import {BeforeQuitActionTypes} from "../constants/action-types";
import {Action} from "redux";

export interface IBeforeQuitState {
    beforeQuit: boolean
}

const initialState: IBeforeQuitState = {
    beforeQuit: false
};

export const beforeQuitReducer = (
    state = initialState, 
    action: Action<BeforeQuitActionTypes>): IBeforeQuitState => {
    switch (action.type) {
        case BeforeQuitActionTypes.BEFORE_QUIT:
            return Object.assign({}, state, {
                beforeQuit: (action as IBeforeQuitAction).payload.beforeQuit
            });
        default:
            return state;
    }
};