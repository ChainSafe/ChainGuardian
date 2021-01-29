import {IRootState} from "../reducers";

export const isApplicationLoading = (state: IRootState): boolean =>
    state.settings.initialBeacons || state.settings.initialValidators;

export const isLoadingValidator = (state: IRootState): boolean => state.settings.loadingValidator;
