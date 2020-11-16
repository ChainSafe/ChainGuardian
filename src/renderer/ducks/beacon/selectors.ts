import {IRootState} from "../reducers";
import {IBeaconState} from "./slice";

export const getBeacons = (state: IRootState): IBeaconState => state.beacons;

export const getHasBeacons = (state: IRootState): boolean => !!state.beacons.keys.length;
