import {BeforeQuitActionTypes} from "../constants/action-types";
import {Action, Dispatch} from "redux";

export const storeBeforeQuitAction = (beforeQuit: boolean) =>
    (dispatch: Dispatch<IBeforeQuitAction>): void => {
        dispatch(setBeforeQuit(beforeQuit));
    };
export const setBeforeQuit = (beforeQuit: boolean): IBeforeQuitAction => ({
    type: BeforeQuitActionTypes.BEFORE_QUIT, payload: {beforeQuit}
});
export interface IStoreBeforeQuitPayload {
    beforeQuit: boolean;
}
export interface IBeforeQuitAction extends Action<BeforeQuitActionTypes> {
    payload: IStoreBeforeQuitPayload;
}