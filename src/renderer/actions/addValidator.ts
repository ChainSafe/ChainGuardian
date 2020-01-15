import {AddValidatorActionTypes} from "../constants/action-types";
import {Action, Dispatch} from "redux";

export const storeAddValidatorAction = (addValidator: boolean) =>
    (dispatch: Dispatch<IAddValidatorAction>): void => {
        dispatch(setAddValidator(addValidator));
    };
export const setAddValidator = (addValidator: boolean): IAddValidatorAction => ({
    type: AddValidatorActionTypes.ADD_VALIDATOR, payload: {addValidator}
});
export interface IStoreAddValidatorPayload {
    addValidator: boolean;
}
export interface IAddValidatorAction extends Action<AddValidatorActionTypes> {
    payload: IStoreAddValidatorPayload;
}