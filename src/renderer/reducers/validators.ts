import {ValidatorResponse} from "@chainsafe/lodestar-types";
import {toHexString} from "@chainsafe/ssz";
import {Action} from "redux";

import {ILoadValidators, ILoadedValidatorsFromChainAction, IStopValidatorServiceAction} from "../actions";
import {IStartValidatorServiceAction} from "../actions/validator";
import {ValidatorActionTypes} from "../constants/action-types";
import {IValidator} from "../containers/Dashboard/DashboardContainer";

export interface IValidatorState {
    [validatorAddress: string]: IValidator & {
        isRunning: boolean,
    },
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
                validatorMap[v.publicKey] = {
                    ...v,
                    isRunning: false,
                };
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

        case ValidatorActionTypes.START_VALIDATOR_SERVICE:
            payload = (action as IStartValidatorServiceAction).payload;
            const publicKey = payload.keypair.publicKey.toHexString();
            return {
                ...state,
                [publicKey]: {...state[publicKey], isRunning: true}
            };

        case ValidatorActionTypes.STOP_VALIDATOR_SERVICE:
            payload = (action as IStopValidatorServiceAction).payload;
            return {
                ...state,
                [payload]: {...state[payload], isRunning: false}
            };
        default:
            return state;
    }
};
