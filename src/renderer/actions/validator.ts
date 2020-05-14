import {ValidatorResponse} from "@chainsafe/lodestar-types";
import {Action, Dispatch} from "redux";

import {ValidatorActionTypes} from "../constants/action-types";
import {IValidator} from "../containers/Dashboard/DashboardContainer";
import {IRootState} from "../reducers";
import {fromHex} from "../services/utils/bytes";
import {loadValidatorBeaconNodes} from "./network";

export interface ILoadValidators {
    type: typeof ValidatorActionTypes.LOAD_VALIDATORS,
    payload: Array<IValidator>,
}

export const loadValidatorsAction = () => {
    return async (dispatch: Dispatch<Action<unknown>>, getState: () => IRootState): Promise<void> => {
        const auth = getState().auth;
        if (auth && auth.account) {
            const validators = auth.account.getValidators();
            const validatorArray = validators.map((v) => ({
                name: auth.account!.name,
                status: "TODO status",
                publicKey: v.publicKey.toHexString(),
                network: auth.account!.getValidatorNetwork(v.publicKey.toHexString()),
                privateKey: v.privateKey.toHexString()
            }));

            dispatch({
                type: ValidatorActionTypes.LOAD_VALIDATORS,
                payload: validatorArray,
            });

            const publicKeys = validatorArray.map((v) => v.publicKey);
            // Initialize all validator objects with API clients
            await Promise.all(publicKeys.map(async (publicKey) => {
                await loadValidatorBeaconNodes(publicKey, true)(dispatch, getState);
            }));
            // Load validator state from chain for i.e. balance
            loadValidatorsFromChain(publicKeys)(dispatch, getState);
        }
    };
};

export const loadValidatorsFromChain = (validators: string[]) => {
    return async (dispatch: Dispatch<Action<ValidatorActionTypes>>, getState: () => IRootState): Promise<void> => {
        const beaconNodes = getState().network.validatorBeaconNodes[validators[0]];
        // TODO: Use any working beacon node instead of first one
        const client = beaconNodes[0].client;
        const pubKeys = validators.map(address => fromHex(address));
        const response = await client.beacon.getValidators(pubKeys);

        dispatch({
            type: ValidatorActionTypes.LOADED_VALIDATORS_FROM_CHAIN,
            payload: response,
        });
    };
};

export interface ILoadedValidatorsFromChainAction {
    type: typeof ValidatorActionTypes.LOADED_VALIDATORS_FROM_CHAIN;
    payload: ValidatorResponse[];
}
