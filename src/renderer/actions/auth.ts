import {AuthActionTypes} from "../constants/action-types";
import {Action, Dispatch} from "redux";
import {IValidator} from "../containers/Dashboard/DashboardContainer";
import {CGAccount} from "../models/account";
import {IRootState} from "../reducers";

//Login Authentication
export const storeAuthAction = (auth: CGAccount) =>
    (dispatch: Dispatch<IStoreAuthAction>): void => {
        dispatch(setAuth(auth));
    };
export const setAuth = (auth: CGAccount): IStoreAuthAction => ({
    type: AuthActionTypes.STORE_AUTH, payload: {auth}
});
export interface IStoreAuthPayload {
    auth: CGAccount;
}
export interface IStoreAuthAction extends Action<AuthActionTypes> {
    payload: IStoreAuthPayload;
}

export interface ILoadValidators {
    type: typeof AuthActionTypes.LOAD_VALIDATORS,
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
                type: AuthActionTypes.LOAD_VALIDATORS,
                payload: validatorArray,
            })
        }
    }
};
