import {Gwei} from "@chainsafe/lodestar-types";
import {Action, Dispatch} from "redux";

import {ValidatorActionTypes} from "../constants/action-types";
import {IValidator} from "../containers/Dashboard/DashboardContainer";
import {IRootState} from "../reducers";
import {fromHex} from "../services/utils/bytes";

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
                deposit: 30,
                network: auth.account!.getValidatorNetwork(v.publicKey.toHexString()),
                privateKey: v.privateKey.toHexString()
            }));

            dispatch({
                type: ValidatorActionTypes.LOAD_VALIDATORS,
                payload: validatorArray,
            });
        }
    };
};

export const loadValidatorBalance = (validator: string) => {
    return async (dispatch: Dispatch<Action<ValidatorActionTypes>>, getState: () => IRootState): Promise<void> => {
        const beaconNodes = getState().network.validatorBeaconNodes[validator];
        // TODO: Use any working beacon node instead of first one
        const client = beaconNodes[0].client;
        const response = await client.beacon.getValidator(fromHex(validator));

        dispatch({
            type: ValidatorActionTypes.LOADED_VALIDATOR_BALANCE,
            payload: {
                balance: response.balance,
                validator,
            },
        });
    };
};

export interface ILoadedValidatorBalanceAction {
    type: typeof ValidatorActionTypes.LOADED_VALIDATOR_BALANCE;
    payload: {
        balance: Gwei,
        validator: string;
    };
}
