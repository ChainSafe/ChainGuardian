import {ValidatorResponse} from "@chainsafe/lodestar-types";
import {toHexString} from "@chainsafe/ssz";
import {Action} from "redux";

import {ILoadValidators, ILoadedValidatorsFromChainAction} from "../actions";
import {ValidatorActionTypes} from "../constants/action-types";
import {IValidator} from "../containers/Dashboard/DashboardContainer";

export interface IValidatorState {
    [validatorAddress: string]: IValidator,
}

const initialState: IValidatorState = {
};

export const validatorsReducer = (
    state = initialState,
    action: Action<ValidatorActionTypes>
): IValidatorState => {
    let payload: any;
    switch (action.type) {
        case ValidatorActionTypes.LOAD_VALIDATORS:
            /* eslint-disable no-case-declarations */
            const validatorMap: IValidatorState = {};
            (action as ILoadValidators).payload.forEach((v: IValidator) => {
                validatorMap[v.publicKey] = v;
            });

            return validatorMap;
        case ValidatorActionTypes.LOADED_VALIDATORS_FROM_CHAIN:
            payload = (action as ILoadedValidatorsFromChainAction).payload;
            const newState = {...state};
            payload.map((v: ValidatorResponse) => {
                const publicKey = toHexString(v.pubkey);
                // Take balance only
                newState[publicKey] = {...state[publicKey], balance: v.balance};
            });
            return newState;
        default:
            return state;
    }
};
