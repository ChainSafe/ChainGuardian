import {ValidatorResponse} from "@chainsafe/lodestar-types";
import {toHexString} from "@chainsafe/ssz";
import {Action} from "redux";

import {
    ILoadValidators,
    ILoadedValidatorsFromChainAction,
    IStopValidatorServiceAction,
    IValidator,
    IRemoveValidator,
    IAddValidator,
    ILoadValidatorStatusAction,
    IStartValidatorServiceAction,
} from "../actions";
import {ValidatorActionTypes} from "../constants/action-types";
import {ValidatorLogger} from "../services/eth2/client/logger";

export interface IValidatorComplete extends IValidator {
    logger?: ValidatorLogger,
}

export interface IValidatorState {
    byPublicKey: {
        [publicKey: string]: IValidatorComplete,
    },
    allPublicKeys: string[],
}

const initialState: IValidatorState = {
    byPublicKey: {},
    allPublicKeys: [],
};

const addValidator = (state: IValidatorState, validator: IValidator): IValidatorState => {
    return {
        byPublicKey: {
            ...state.byPublicKey,
            [validator.publicKey]: validator,
        },
        allPublicKeys: state.allPublicKeys.concat(validator.publicKey),
    };
};

const removeValidator = (state: IValidatorState, publicKey: string): IValidatorState => {
    const newState = {...state};
    delete newState.byPublicKey[publicKey];
    newState.allPublicKeys = state.allPublicKeys.filter(vKey => vKey !== publicKey);

    return newState;
};

export const validatorsReducer = (
    state = initialState,
    action: Action<ValidatorActionTypes>
): IValidatorState => {
    let payload: any;
    let newState = initialState;
    switch (action.type) {
        case ValidatorActionTypes.LOAD_VALIDATORS:
            (action as ILoadValidators).payload.forEach((v: IValidator) => {
                newState = addValidator(newState, v);
            });

            return newState;

        case ValidatorActionTypes.ADD_VALIDATOR:
            payload = (action as IAddValidator).payload;
            return addValidator(state, payload);

        case ValidatorActionTypes.REMOVE_VALIDATOR:
            payload = (action as IRemoveValidator).payload;
            return removeValidator(state, payload.validator);

        case ValidatorActionTypes.LOADED_VALIDATORS_BALANCE:
            payload = (action as ILoadedValidatorsFromChainAction).payload;
            newState = {...state};
            payload.map((v: ValidatorResponse) => {
                const publicKey = toHexString(v.pubkey);
                // Take balance only
                newState.byPublicKey[publicKey] = {...state.byPublicKey[publicKey], balance: v.balance};
            });
            return newState;

        case ValidatorActionTypes.START_VALIDATOR_SERVICE:
            payload = (action as IStartValidatorServiceAction).payload;
            newState = {...state};
            newState.byPublicKey[payload.validator] = {
                ...state.byPublicKey[payload.keypair.publicKey.toHexString()],
                isRunning: true,
                logger: payload.logger,
            };

            return newState;

        case ValidatorActionTypes.STOP_VALIDATOR_SERVICE:
            payload = (action as IStopValidatorServiceAction).payload;
            newState = {...state};
            newState.byPublicKey[payload] = {
                ...state.byPublicKey[payload],
                isRunning: false
            };
            return newState;

        case ValidatorActionTypes.LOAD_STATUS:
            payload = (action as ILoadValidatorStatusAction).payload;
            newState = {...state};
            newState.byPublicKey[payload.validator] = {
                ...state.byPublicKey[payload.validator],
                status: payload.status
            };
            return newState;

        default:
            return state;
    }
};
