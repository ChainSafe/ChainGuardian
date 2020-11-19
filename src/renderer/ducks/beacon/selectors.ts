import {IRootState} from "../reducers";
import {IBeaconState, IBeaconDictionary} from "./slice";

export const getBeacons = (state: IRootState): IBeaconState => state.beacons;

export const getBeaconDictionary = (state: IRootState): IBeaconDictionary => state.beacons.beacons;

export const getBeaconKeys = (state: IRootState): string[] => state.beacons.keys;

export const getHasBeacons = (state: IRootState): boolean => !!state.beacons.keys.length;
