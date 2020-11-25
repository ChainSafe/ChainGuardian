import {IRootState} from "../reducers";
import {createSelector} from "@reduxjs/toolkit";
import {getPublicKeyFromProps} from "../fromProps";
import {IByPublicKey} from "./slice";
import {getSelectedNetwork} from "../network/selectors";
import {getBeaconDictionary} from "../beacon/selectors";

export const getValidators = (state: IRootState): IByPublicKey => state.validators.byPublicKey;

export const getValidatorKeys = (state: IRootState): string[] => state.validators.allPublicKeys;

export const getNetworkValidators = createSelector(
    getValidators,
    getValidatorKeys,
    getSelectedNetwork,
    (validators, keys, network) => keys.filter((key) => validators[key].network === network || !network),
);

export const getValidator = createSelector(getValidators, getPublicKeyFromProps, (validators, key) => validators[key]);

export const getValidatorNetwork = createSelector(getValidator, (validator) => validator?.network);

export const getValidatorBeaconNodes = createSelector(
    getValidator,
    getBeaconDictionary,
    (validator, beacons) => validator?.beaconNodes.map((url) => beacons[url]).filter((beacon) => !!beacon) || [],
);

export const getValidatorsByBeaconNode = createSelector(getValidators, getValidatorKeys, (validators, keys) => {
    const dictionary: {[url: string]: {name: string; publicKey: string}[]} = {};
    keys.forEach((key) => {
        const {name, publicKey, beaconNodes} = validators[key];
        beaconNodes.forEach((url) => {
            if (!dictionary[url]) {
                dictionary[url] = [];
            }

            dictionary[url].push({name, publicKey});
        });
    });
    return dictionary;
});
