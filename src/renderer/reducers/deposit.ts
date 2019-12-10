import {IGenerateDepositAction, IVerifyDepositAction} from "../actions";
import {DepositActionTypes} from "../constants/action-types";
import {Action} from "redux";

export interface IDepositState {
    isDepositVisible: boolean;
    txData: string;
}

const initialState: IDepositState = {
    isDepositVisible: false,
    txData: ""
};

export const depositReducer = (state = initialState, action: Action<DepositActionTypes>): IDepositState => {
    switch (action.type) {
        case DepositActionTypes.DEPOSIT_TRANSACTION:
            return Object.assign({}, state, {
                txData: (action as IGenerateDepositAction).payload.txData
            });

        case DepositActionTypes.DEPOSIT_VISIBLE:
            return Object.assign({}, state, {
                isDepositVisible: (action as IVerifyDepositAction).payload.isDepositVisible
            });
        default:
            return state;
    }
};