import {NotificationActionTypes} from "../constants/action-types";
import {Action, Dispatch} from "redux";
import {INotificationState} from "../reducers/notification";
import {Horizontal, Vertical} from "../components/Notification/NotificationEnums";

//Add Notification
/** expireTime is in ms */
export const storeNotificationAction = (notification: INotificationState, expireTime?: number
) =>
    (dispatch: Dispatch<IStoreNotificationAction>): void => {
        let isStacked = false;
        if(notification.horizontalPosition===Horizontal.RIGHT 
            && notification.verticalPosition===Vertical.BOTTOM)
            isStacked = true;
        dispatch(setNotification( notification
        ));
        expireTime ? setTimeout(dispatch, expireTime, setRemoveNotification(0,isStacked)) : null;
    };
export const setNotification = (props: INotificationState
): IStoreNotificationAction => ({
    type: NotificationActionTypes.ADD_NOTIFICATION, payload: props
});
export interface IStoreNotificationAction extends Action<NotificationActionTypes> {
    payload: INotificationState;
}

//Remove Notification
export const removeNotificationAction = (
    index: number,
    stackedArray: boolean
) => 
    (dispatch: Dispatch<IRemoveNotificationAction>): void => {
        dispatch(setRemoveNotification(
            index,
            stackedArray
        ));
    };
export const setRemoveNotification = (
    index: number,
    stackedArray: boolean
): IRemoveNotificationAction => ({
    type: NotificationActionTypes.REMOVE_NOTIFICATION, payload: {
        index,
        stackedArray
    }
});
export interface IRemoveNotificationPayload {
    index: number,
    stackedArray: boolean
}
export interface IRemoveNotificationAction extends Action<NotificationActionTypes> {
    payload: IRemoveNotificationPayload
}