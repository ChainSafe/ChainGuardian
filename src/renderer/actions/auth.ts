import {DEFAULT_ACCOUNT} from "../constants/account";
import {AuthActionTypes} from "../constants/action-types";
import {Action, Dispatch} from "redux";
import {CGAccount} from "../models/account";
import database from "../services/db/api/database";

//Login Authentication
export const loadAccountAction = (account = DEFAULT_ACCOUNT) =>
    async (dispatch: Dispatch<IStoreAuthAction>): Promise<void> => {
        const CGaccount = await database.account.get(account);
        if (CGaccount !== null) {
            dispatch(setAuth(CGaccount));
        }
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

