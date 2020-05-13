import {Gwei} from "@chainsafe/lodestar-types";
import {Action, Dispatch} from "redux";

import {ValidatorActionTypes} from "../constants/action-types";
import {IRootState} from "../reducers";
import {fromHex} from "../services/utils/bytes";

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
