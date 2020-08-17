import {ValidatorResponse} from "@chainsafe/lodestar-types";
import {toHexString} from "@chainsafe/ssz";
import {IValidator, ValidatorAction, ValidatorActionTypes} from "../actions/validator";
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
    action: ValidatorAction
): IValidatorState => {
    let newState = initialState;
    switch (action.type) {
        case ValidatorActionTypes.LOAD_VALIDATORS:
            action.payload.forEach((v: IValidator) => {
                newState = addValidator(newState, v);
            });

            return newState;

        case ValidatorActionTypes.ADD_VALIDATOR:
            return addValidator(state, action.payload);

        case ValidatorActionTypes.REMOVE_VALIDATOR:
            return removeValidator(state, action.payload.validatorPublicKey);

        case ValidatorActionTypes.LOADED_VALIDATORS_BALANCE:
            newState = {...state};
            action.payload.map((v: ValidatorResponse) => {
                const publicKey = toHexString(v.pubkey);
                // Take balance only
                newState.byPublicKey[publicKey] = {...state.byPublicKey[publicKey], balance: v.balance};
            });
            return newState;

        case ValidatorActionTypes.START_VALIDATOR_SERVICE:
            newState = {...state};
            newState.byPublicKey[action.payload.keypairs[0].publicKey.toHexString()] = {
                ...state.byPublicKey[action.payload.keypairs[0].publicKey.toHexString()],
                isRunning: true,
                logger: action.payload.logger,
            };

            return newState;

        case ValidatorActionTypes.STOP_VALIDATOR_SERVICE:
            newState = {...state};
            newState.byPublicKey[action.payload] = {
                ...state.byPublicKey[action.payload],
                isRunning: false
            };
            return newState;

        case ValidatorActionTypes.LOAD_VALIDATOR_STATUS:
            newState = {...state};
            newState.byPublicKey[action.payload.validator] = {
                ...state.byPublicKey[action.payload.validator],
                status: action.payload.status
            };
            return newState;

        default:
            return state;
    }
};
