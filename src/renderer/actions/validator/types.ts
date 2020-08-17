import {ICGKeystore} from "../../services/keystore";
import {ValidatorStatus} from "../../services/validator/status";
import {IValidatorOptions} from "@chainsafe/lodestar-validator/lib";
import {ValidatorResponse} from "@chainsafe/lodestar-types";
import {ValidatorLogger} from "../../services/eth2/client/logger";

export enum ValidatorActionTypes {
    LOAD_VALIDATORS = "LOAD_VALIDATORS",
    ADD_VALIDATOR = "ADD_VALIDATOR",
    REMOVE_VALIDATOR = "REMOVE_VALIDATOR",
    LOAD_VALIDATOR_CHAIN_DATA = "LOAD_VALIDATOR_CHAIN_DATA",
    LOADED_VALIDATORS_BALANCE = "LOADED_VALIDATORS_BALANCE",
    START_VALIDATOR_SERVICE = "START_VALIDATOR_SERVICE",
    STOP_VALIDATOR_SERVICE = "STOP_VALIDATOR_SERVICE",
    LOAD_VALIDATOR_STATUS = "LOAD_STATUS"
}

export type IValidator = {
    name: string;
    status: string;
    publicKey: string;
    network: string;
    balance?: bigint;
    keystore: ICGKeystore;
    isRunning: boolean,
};

export type LoadValidatorsAction = {
    type: typeof ValidatorActionTypes.LOAD_VALIDATORS,
    payload: Array<IValidator>,
};

export type AddValidatorAction = {
    type: typeof ValidatorActionTypes.ADD_VALIDATOR,
    payload: IValidator,
};

export type RemoveValidatorAction = {
    type: typeof ValidatorActionTypes.REMOVE_VALIDATOR,
    payload: {
        validatorPublicKey: string,
    },
};

export type LoadValidatorChainDataAction = {
    type: typeof ValidatorActionTypes.LOAD_VALIDATOR_CHAIN_DATA
};

export type LoadedValidatorBalanceAction = {
    type: typeof ValidatorActionTypes.LOADED_VALIDATORS_BALANCE,
    payload: ValidatorResponse[];
};

export type LoadValidatorStatusAction = {
    type: typeof ValidatorActionTypes.LOAD_VALIDATOR_STATUS,
    payload: {
        validator: string;
        status: ValidatorStatus;
    },
};

export type StartValidatorServiceAction = {
    type: typeof ValidatorActionTypes.START_VALIDATOR_SERVICE,
    payload: IValidatorOptions & {logger: ValidatorLogger},
};

export type StopValidatorServiceAction = {
    type: typeof ValidatorActionTypes.STOP_VALIDATOR_SERVICE,
    payload: string,
};

export type ValidatorAction =
    LoadValidatorsAction
    | AddValidatorAction
    | RemoveValidatorAction
    | LoadValidatorChainDataAction
    | LoadedValidatorBalanceAction
    | LoadValidatorStatusAction
    | StartValidatorServiceAction
    | StopValidatorServiceAction;
