import {NotificationActionTypes} from "../constants/action-types";
import {Action, Dispatch} from "redux";
import {INotificationState} from "../reducers/notification"
import {Level, Horizontal, Vertical} from "../components/Notification/NotificationEnums"
//Notification
export const storeNotificationAction = (notification: INotificationState) =>
    (dispatch: Dispatch<IStoreNotificationAction>): void => {
        dispatch(setNotification(notification));
    };
export const setNotification = (notification: INotificationState): IStoreNotificationAction => ({
    type: NotificationActionTypes.ADD_NOTIFICATION, payload: {
        notification
    }
});
export interface IStoreNotificationPayload {
    notification: INotificationState
}
export interface IStoreNotificationAction extends Action<NotificationActionTypes> {
    payload: IStoreNotificationPayload;
}