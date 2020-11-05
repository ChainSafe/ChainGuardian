import {IRootState} from "../reducers";
import {IValidatorBeaconNodes} from "../../models/beaconNode";
import {BlockSubscriptions} from "./types";
import {createSelector} from "@reduxjs/toolkit";
import {getValidatorFromProps} from "../fromProps";

export const getBeaconNodes = (state: IRootState): IValidatorBeaconNodes => state.network.validatorBeaconNodes;

export const getValidatorBlockSubscriptions = (state: IRootState): BlockSubscriptions =>
    state.network.blockSubscriptions;

export const getSelectedNetwork = (state: IRootState): string | undefined => state.network.selected;

export const getPullingDockerImage = (state: IRootState): boolean => state.network.pullingDockerImage;

export const getFinishedPullingDockerImage = (state: IRootState): boolean => state.network.finishedPullingDockerImage;

export const getValidatorBlockSubscription = createSelector(
    getValidatorBlockSubscriptions,
    getValidatorFromProps,
    (subscribtions, validator) => subscribtions[validator],
);

export const getValidatorBeaconNodes = createSelector(
    getBeaconNodes,
    getValidatorFromProps,
    (nodes, validator) => nodes[validator],
);
