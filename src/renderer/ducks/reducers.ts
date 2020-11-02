import {combineReducers} from "redux";
import {depositSlice} from "./deposit/slice";
import {authSlice} from "./auth/slice";
import {networkSlice} from "./network/slice";
import {notificationSlice} from "./notification/slice";
import {registerSlice} from "./register/slice";
import {validatorSlice} from "./validator/slice";

export type IRootState = ReturnType<typeof rootReducer>;

export const rootReducer = combineReducers({
    register: registerSlice.reducer,
    deposit: depositSlice.reducer,
    auth: authSlice.reducer,
    notificationArray: notificationSlice.reducer,
    network: networkSlice.reducer,
    validators: validatorSlice.reducer,
});
