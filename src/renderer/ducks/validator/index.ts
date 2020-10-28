import {Dispatch} from "redux";
import {IRootState} from "../../reducers";
import {CGAccount} from "../../models/account";
import {deleteKeystore} from "../../services/utils/account";
import {fromHex} from "../../services/utils/bytes";
import {getNetworkConfig} from "../../services/eth2/networks";
import {EthersNotifier} from "../../services/deposit/ethers";
import {getValidatorStatus} from "../../services/validator/status";
import {Keypair} from "@chainsafe/bls";
import {ValidatorLogger} from "../../services/eth2/client/logger";
import {ValidatorDB} from "../../services/db/api/validator";
import database from "../../services/db/api/database";
import {config} from "@chainsafe/lodestar-config/lib/presets/minimal";
import {
    AddValidatorAction,
    IValidator,
    LoadedValidatorBalanceAction,
    LoadValidatorsAction,
    LoadValidatorStatusAction,
    RemoveValidatorAction,
    StartValidatorServiceAction,
    StopValidatorServiceAction,
    ValidatorAction,
    ValidatorActionTypes
} from "./types";

export * from "./types";


export const loadValidatorsAction = () => {
    return async (dispatch: Dispatch<LoadValidatorsAction>, getState: () => IRootState): Promise<void> => {
        const auth = getState().auth;
        if (auth && auth.account) {
            const validators = await auth.account.loadValidators();
            const validatorArray: IValidator[] = validators.map((v, index) => ({
                name: v.getName() ?? `Validator - ${index}`,
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


export const addNewValidator = (publicKey: string, account: CGAccount) => {
    return async (dispatch: Dispatch<AddValidatorAction>): Promise<void> => {
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


export const removeValidatorAction = (publicKey: string, validatorIndex: number) => {
    return async (
        dispatch: Dispatch<RemoveValidatorAction|UnsubscribeToBlockListeningAction>, getState: () => IRootState
    ): Promise<void> => {
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
    return async (
        dispatch: Dispatch<ValidatorAction|NetworkAction>, getState: () => IRootState
    ): Promise<void> => {
        // Initialize validator object with API client
        await loadValidatorBeaconNodes(publicKey, true)(dispatch, getState);
        // Load validator state from chain for i.e. balance
        // TODO: load all validators in one request per network
        await Promise.all([
            loadValidatorsFromChain([publicKey])(dispatch, getState),
            loadValidatorStatus(publicKey)(dispatch, getState)
        ]);

        dispatch({
            type: ValidatorActionTypes.LOAD_VALIDATOR_CHAIN_DATA,
        });
    };
};

export const loadValidatorsFromChain = (validators: string[]) => {
    return async (dispatch: Dispatch<LoadedValidatorBalanceAction>, getState: () => IRootState): Promise<void> => {
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
    return async (dispatch: Dispatch<LoadValidatorStatusAction>, getState: () => IRootState): Promise<void> => {
        const beaconNodes = getState().network.validatorBeaconNodes[validatorAddress];
        if (beaconNodes && beaconNodes.length > 0) {
            // TODO: Use any working beacon node instead of first one
            const eth2 = beaconNodes[0].client;
            const network = getState().validators.byPublicKey[validatorAddress].network;
            const networkConfig = getNetworkConfig(network);
            const eth1 = new EthersNotifier(networkConfig, networkConfig.eth1Provider);
            const status = await getValidatorStatus(fromHex(validatorAddress), eth2, eth1);

            dispatch({
                type: ValidatorActionTypes.LOAD_VALIDATOR_STATUS,
                payload: {
                    validator: validatorAddress,
                    status,
                },
            });
        }
    };
};


export const startValidatorService = (keypair: Keypair) => {
    return (dispatch: Dispatch<StartValidatorServiceAction>, getState: () => IRootState): void => {
        const logger = new ValidatorLogger();
        // TODO: Use beacon chain proxy instead of first node
        const eth2API = getState().network.validatorBeaconNodes[keypair.publicKey.toHexString()][0].client;

        dispatch({
            type: ValidatorActionTypes.START_VALIDATOR_SERVICE,
            payload: {
                db: new ValidatorDB(database),
                api: eth2API,
                config,
                keypairs: [keypair],
                logger
            },
        });
    };
};

export const stopValidatorService = (keypair: Keypair) => {
    return (dispatch: Dispatch<StopValidatorServiceAction>): void => {
        dispatch({
            type: ValidatorActionTypes.STOP_VALIDATOR_SERVICE,
            payload: keypair.publicKey.toHexString(),
        });
    };
};
