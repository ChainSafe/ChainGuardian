import {combineReducers} from "redux";
import {authSlice} from "./auth/slice";
import {networkSlice} from "./network/slice";
import {notificationSlice} from "./notification/slice";
import {registerSlice} from "./register/slice";
import {validatorSlice} from "./validator/slice";
import {beaconSlice} from "./beacon/slice";
import {settingsSlice} from "./settings/slice";

export type IRootState = ReturnType<typeof rootReducer>;

export const rootReducer = combineReducers({
    register: registerSlice.reducer,
    auth: authSlice.reducer,
    notificationArray: notificationSlice.reducer,
    network: networkSlice.reducer,
    validators: validatorSlice.reducer,
    beacons: beaconSlice.reducer,
    settings: settingsSlice.reducer,
});
