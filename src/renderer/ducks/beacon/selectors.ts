import {IRootState} from "../reducers";
import {IBeaconState, IBeaconDictionary} from "./slice";
import {createSelector} from "@reduxjs/toolkit";
import {getKeyFromProps} from "../fromProps";

export const getBeacons = (state: IRootState): IBeaconState => state.beacons;

export const getBeaconDictionary = (state: IRootState): IBeaconDictionary => state.beacons.beacons;

export const getBeaconByKey = createSelector(getBeaconDictionary, getKeyFromProps, (beacons, key) => beacons[key]);

export const getBeaconKeys = (state: IRootState): string[] => state.beacons.keys;

export const getHasBeacons = (state: IRootState): boolean => !!state.beacons.keys.length;
