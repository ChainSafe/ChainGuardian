import {IAddValidatorAction} from "../actions";
import {AddValidatorActionTypes} from "../constants/action-types";
import {Action} from "redux";

export interface IAddValidatorState {
    addValidator: boolean
}

const initialState: IAddValidatorState = {
    addValidator: false
}

export const addValidatorReducer = (state = initialState, action: Action<AddValidatorActionTypes>): IAddValidatorState => {
    switch (action.type) {
        case AddValidatorActionTypes.ADD_VALIDATOR:
            return Object.assign({}, state, {
                addValidator: (action as IAddValidatorAction).payload.addValidator
            });
        default:
            return state;
    }
}