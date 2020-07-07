import {Keypair} from "@chainsafe/bls";
import {config} from "@chainsafe/lodestar-config/lib/presets/minimal";
import {ValidatorResponse} from "@chainsafe/lodestar-types";
import {IValidatorOptions} from "@chainsafe/lodestar-validator/lib";
import {Action, Dispatch} from "redux";

import {ValidatorActionTypes} from "../constants/action-types";
import {CGAccount} from "../models/account";
import {IRootState} from "../reducers";
import database from "../services/db/api/database";
import {ValidatorDB} from "../services/db/api/validator";
import {EthersNotifier} from "../services/deposit/ethers";
import {ValidatorLogger} from "../services/eth2/client/logger";
import {getNetworkConfig} from "../services/eth2/networks";
import {ICGKeystore} from "../services/keystore";
import {deleteKeystore} from "../services/utils/account";
import {fromHex} from "../services/utils/bytes";
import {getValidatorStatus, ValidatorStatus} from "../services/validator/status";
import {loadValidatorBeaconNodes, unsubscribeToBlockListening} from "./network";

export interface ILoadValidators {
    type: typeof ValidatorActionTypes.LOAD_VALIDATORS,
    payload: Array<IValidator>,
}

export interface IValidator {
    name: string;
    status: string;
    publicKey: string;
    network: string;
    balance?: bigint;
    keystore: ICGKeystore;
    isRunning: boolean,
}

export const loadValidatorsAction = () => {
    return async (dispatch: Dispatch<Action<unknown>>, getState: () => IRootState): Promise<void> => {
        const auth = getState().auth;
        if (auth && auth.account) {
            const validators = await auth.account.loadValidators();
            const validatorArray: IValidator[] = validators.map((v, index) => ({
                name: `Validator ${index+1}`,
                status: undefined,
                publicKey: v.getPublicKey(),
                network: auth.account!.getValidatorNetwork(v.getPublicKey()),
                keystore: v,
                isRunning: undefined,
            }));

            dispatch({
                type: ValidatorActionTypes.LOAD_VALIDATORS,
                payload: validatorArray
            });
        }
    };
};

export interface IAddValidator {
    type: typeof ValidatorActionTypes.ADD_VALIDATOR,
    payload: IValidator,
}

export const addNewValidator = (publicKey: string, account: CGAccount) => {
    return async (dispatch: Dispatch<Action<unknown>>): Promise<void> => {
        const keystore = account.loadKeystore(publicKey);
        const validator: IValidator = {
            name: `Validator ${account.getValidators().length+2}`,
            publicKey,
            network: account!.getValidatorNetwork(publicKey),
            keystore,
            status: undefined,
            isRunning: false,
        };

        dispatch({
            type: ValidatorActionTypes.ADD_VALIDATOR,
            payload: validator,
        });
    };
};

export interface IRemoveValidator {
    type: typeof ValidatorActionTypes.REMOVE_VALIDATOR,
    payload: {
        validatorPublicKey: string,
    },
}

export const removeValidatorAction = (publicKey: string, validatorIndex: number) => {
    return async (dispatch: Dispatch<Action<unknown>>, getState: () => IRootState): Promise<void> => {
        deleteKeystore(getState().auth.account.directory, publicKey);
        getState().auth.account.removeValidator(validatorIndex);
        dispatch(unsubscribeToBlockListening(publicKey));

        dispatch({
            type: ValidatorActionTypes.REMOVE_VALIDATOR,
            payload: {
                validatorPublicKey: publicKey,
            },
        });
    };
};

export const loadValidatorChainDataAction = (publicKey: string) => {
    return async (dispatch: Dispatch<Action<unknown>>, getState: () => IRootState): Promise<void> => {
        // Initialize validator object with API client
        await loadValidatorBeaconNodes(publicKey, true)(dispatch, getState);
        // Load validator state from chain for i.e. balance
        // TODO: load all validators in one request per network
        loadValidatorsFromChain([publicKey])(dispatch, getState);
        loadValidatorStatus(publicKey)(dispatch, getState);

        dispatch({
            type: ValidatorActionTypes.LOAD_VALIDATOR_CHAIN_DATA,
        });
    };
};

export const loadValidatorsFromChain = (validators: string[]) => {
    return async (dispatch: Dispatch<Action<ValidatorActionTypes>>, getState: () => IRootState): Promise<void> => {
        const beaconNodes = getState().network.validatorBeaconNodes[validators[0]];
        if (beaconNodes && beaconNodes.length > 0) {
            // TODO: Use any working beacon node instead of first one
            const client = beaconNodes[0].client;
            const pubKeys = validators.map(address => fromHex(address));
            const response = await client.beacon.getValidators(pubKeys);

            dispatch({
                type: ValidatorActionTypes.LOADED_VALIDATORS_BALANCE,
                payload: response
            });
        }
    };
};

export const loadValidatorStatus = (validatorAddress: string) => {
    return async (dispatch: Dispatch<Action<ValidatorActionTypes>>, getState: () => IRootState): Promise<void> => {
        const beaconNodes = getState().network.validatorBeaconNodes[validatorAddress];
        if (beaconNodes && beaconNodes.length > 0) {
            // TODO: Use any working beacon node instead of first one
            const eth2 = beaconNodes[0].client;
            const network = getState().validators.byPublicKey[validatorAddress].network;
            const networkConfig = getNetworkConfig(network);
            const eth1 = new EthersNotifier(networkConfig, networkConfig.eth1Provider);
            const status = await getValidatorStatus(fromHex(validatorAddress), eth2, eth1);

            dispatch({
                type: ValidatorActionTypes.LOAD_STATUS,
                payload: {
                    validator: validatorAddress,
                    status,
                },
            });
        }
    };
};

export interface ILoadValidatorStatusAction {
    type: typeof ValidatorActionTypes.LOAD_STATUS,
    payload: {
        validator: string;
        status: ValidatorStatus;
    },
}

export interface ILoadedValidatorsFromChainAction {
    type: typeof ValidatorActionTypes.LOADED_VALIDATORS_BALANCE;
    payload: ValidatorResponse[];
}

export interface IStartValidatorServiceAction {
    type: typeof ValidatorActionTypes.START_VALIDATOR_SERVICE,
    payload: IValidatorOptions,
}

export const startValidatorService = (keypair: Keypair) => {
    return (dispatch: Dispatch<Action<ValidatorActionTypes>>, getState: () => IRootState): void => {
        const logger = new ValidatorLogger();
        // TODO: Use beacon chain proxy instead of first node
        const eth2API = getState().network.validatorBeaconNodes[keypair.publicKey.toHexString()][0].client;

        dispatch({
            type: ValidatorActionTypes.START_VALIDATOR_SERVICE,
            payload: {
                db: new ValidatorDB(database),
                api: eth2API,
                config,
                keypair,
                logger
            },
        });
    };
};

export interface IStopValidatorServiceAction {
    type: typeof ValidatorActionTypes.STOP_VALIDATOR_SERVICE,
    payload: string,
}

export const stopValidatorService = (keypair: Keypair) => {
    return (dispatch: Dispatch<Action<ValidatorActionTypes>>): void => {
        dispatch({
            type: ValidatorActionTypes.STOP_VALIDATOR_SERVICE,
            payload: keypair.publicKey.toHexString(),
        });
    };
};
