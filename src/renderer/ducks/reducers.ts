import {combineReducers} from "redux";
import {depositSlice} from "./deposit/slice";
import {authSlice} from "./auth/slice";
import {networkSlice} from "./network/slice";

export type IRootState = ReturnType<typeof rootReducer>;

export const rootReducer = combineReducers({
    register: registerReducer,
    deposit: depositSlice.reducer,
    auth: authSlice.reducer,
    notificationArray: notificationReducer,
    network: networkSlice.reducer,
    validators: validatorsReducer,
});
