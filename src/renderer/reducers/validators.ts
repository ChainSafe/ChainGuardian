import {ValidatorResponse} from "@chainsafe/lodestar-types";
import {toHexString} from "@chainsafe/ssz";
import {Action} from "redux";

import {ILoadValidators, ILoadedValidatorsFromChainAction, IStopValidatorServiceAction, IValidator} from "../actions";
import {IAddValidator, ILoadValidatorStatusAction, IStartValidatorServiceAction} from "../actions/validator";
import {ValidatorActionTypes} from "../constants/action-types";
import {ValidatorLogger} from "../services/eth2/client/logger";

export interface IValidatorState {
    [validatorAddress: string]: IValidator & {
        isRunning: boolean,
        logger?: ValidatorLogger,
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
                    isRunning: state[v.publicKey] ? state[v.publicKey].isRunning : false,
                };
            });

            return validatorMap;

        case ValidatorActionTypes.ADD_VALIDATOR:
            payload = (action as IAddValidator).payload;
            return {
                ...state,
                [payload.publicKey]: {
                    ...payload,
                    isRunning: false,
                }
            };

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
                [publicKey]: {
                    ...state[publicKey],
                    isRunning: true,
                    logger: payload.logger,
                }
            };

        case ValidatorActionTypes.STOP_VALIDATOR_SERVICE:
            payload = (action as IStopValidatorServiceAction).payload;
            return {
                ...state,
                [payload]: {...state[payload], isRunning: false}
            };

        case ValidatorActionTypes.LOAD_STATUS:
            payload = (action as ILoadValidatorStatusAction).payload;
            return {
                ...state,
                [payload.validator]: {
                    ...state[payload.validator],
                    status: payload.status
                },
            };
        default:
            return state;
    }
};
