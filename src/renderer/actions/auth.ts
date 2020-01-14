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
//Storing password
export const storePasswordAction = (password: string) =>
    (dispatch: Dispatch<IStorePasswordAction>): void => {
        dispatch(setPassword(password));
    };
export const setPassword = (password: string): IStorePasswordAction => ({
    type: AuthActionTypes.STORE_PASSWORD, payload: {password}
});
export interface IStorePasswordPayload {
    password: string;
}
export interface IStorePasswordAction extends Action<AuthActionTypes> {
    payload: IStorePasswordPayload;
}