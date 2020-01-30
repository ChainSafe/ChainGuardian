import {NotificationActionTypes} from "../constants/action-types";
import {Action, Dispatch} from "redux";
import {INotificationState} from "../reducers/notification"
import {Level, Horizontal, Vertical} from "../components/Notification/NotificationEnums"
//Notification
export const storeNotificationAction = (
    isVisible: boolean,
    title: string,
    content: string,
    level: Level,
    horizontalPosition: Horizontal,
    verticalPosition: Vertical
) =>
    (dispatch: Dispatch<IStoreNotificationAction>): void => {
        dispatch(setNotification(
            isVisible,
            title,
            content,
            level,
            horizontalPosition,
            verticalPosition
        ));
    };
export const setNotification = (
    isVisible: boolean,
    title: string,
    content: string,
    level: Level,
    horizontalPosition: Horizontal,
    verticalPosition: Vertical
): IStoreNotificationAction => ({
    type: NotificationActionTypes.ADD_NOTIFICATION, payload: {
        isVisible,
        title,
        content,
        level,
        horizontalPosition,
        verticalPosition
    }
});
export interface IStoreNotificationPayload {
        isVisible: boolean,
        title: string,
        content: string,
        level: Level,
        horizontalPosition: Horizontal,
        verticalPosition: Vertical
}
export interface IStoreNotificationAction extends Action<NotificationActionTypes> {
    payload: IStoreNotificationPayload;
}