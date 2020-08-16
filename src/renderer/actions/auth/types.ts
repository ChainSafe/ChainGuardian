import {CGAccount} from "../../models/account";

export enum AuthActionTypes {
    STORE_AUTH = "STORE_AUTH"
}

export type StoreAuthPayload = {
    auth: CGAccount;
};

export type StoreAuthAction  = {
    type: typeof AuthActionTypes.STORE_AUTH,
    payload: StoreAuthPayload
};
