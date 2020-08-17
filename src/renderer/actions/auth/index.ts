import {DEFAULT_ACCOUNT} from "../../constants/account";
import {Dispatch} from "redux";
import database from "../../services/db/api/database";
import {CGAccount} from "../../models/account";
import {AuthActionTypes, StoreAuthAction} from "./types";

export * from "./types";

export const loadAccountAction = (account = DEFAULT_ACCOUNT) =>
    async (dispatch: Dispatch<StoreAuthAction>): Promise<void> => {
        const CGaccount = await database.account.get(account);
        if (CGaccount !== null) {
            dispatch(setAuth(CGaccount));
        }
    };

export const setAuth = (auth: CGAccount): StoreAuthAction => ({
    type: AuthActionTypes.STORE_AUTH, payload: {auth}
});

export type AuthAction = StoreAuthAction;
