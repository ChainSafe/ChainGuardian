import {INotificationProps, INotificationState} from "../../reducers/notification";
import {Dispatch} from "redux";
import {createNotificationId} from "../../services/notification/createNotificationId";
import {Horizontal, Level, Vertical} from "../../components/Notification/NotificationEnums";
import {NotificationActionTypes, RemoveNotificationAction, StoreNotificationAction} from "./types";

export * from "./types";

//Add Notification
/** expireTime is in seconds
 * / only bottom right notifications are stacked one above another
 */
export const storeNotificationAction = (notificationProps: INotificationProps) =>
    (dispatch: Dispatch<StoreNotificationAction>): void => {
        const notificationId = createNotificationId(notificationProps);
        const notification = {
            isVisible: true,
            level: Level.ERROR,
            expireTime: 10,
            horizontalPosition: Horizontal.CENTER,
            verticalPosition: Vertical.TOP,
            ...notificationProps,
            id: notificationId,
        };

        dispatch(setNotification(notification));

        notification.expireTime ?
            setTimeout(
                dispatch,
                notification.expireTime*1000,
                setRemoveNotification(notificationId)
            )
            : null;
    };
export const setNotification = (payload: INotificationState): StoreNotificationAction => {
    return {
        type: NotificationActionTypes.ADD_NOTIFICATION,
        payload,
    };
};

//Remove Notification
export const removeNotificationAction = (id: string) =>
    (dispatch: Dispatch<RemoveNotificationAction>): void => {
        dispatch(setRemoveNotification(
            id
        ));
    };
export const setRemoveNotification = (id: string): RemoveNotificationAction => ({
    type: NotificationActionTypes.REMOVE_NOTIFICATION,
    payload: {
        id
    }
});
