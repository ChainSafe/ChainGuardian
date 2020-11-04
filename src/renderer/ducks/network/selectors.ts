import {IRootState} from "../reducers";
import {IValidatorBeaconNodes} from "../../models/beaconNode";

export const getValidatorBeaconNodes = (state: IRootState): IValidatorBeaconNodes => state.network.validatorBeaconNodes;

export const getSelectedNetwork = (state: IRootState): string | undefined => state.network.selected;

export const getPullingDockerImage = (state: IRootState): boolean => state.network.pullingDockerImage;

export const getFinishedPullingDockerImage = (state: IRootState): boolean => state.network.finishedPullingDockerImage;
