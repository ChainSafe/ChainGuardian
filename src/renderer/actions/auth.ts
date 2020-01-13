import {AuthActionTypes} from "../constants/action-types";
import {Action, Dispatch} from "redux";
import {CGAccount} from "../models/account";

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