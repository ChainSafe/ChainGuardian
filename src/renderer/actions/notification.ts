import {NotificationActionTypes} from "../constants/action-types";
import {Action, Dispatch} from "redux";
import {INotificationState, INotificationProps} from "../reducers/notification";
import {createNotificationId} from "../services/notification/createNotificationId";

//Add Notification
/** expireTime is in seconds
 * / only bottom right notifications are stacked one above another
 */
export const storeNotificationAction = (notification: INotificationProps) =>
    (dispatch: Dispatch<IStoreNotificationAction>): void => {
        
        const notificationId = createNotificationId(notification);

        dispatch(setNotification( 
            notification,
            notificationId
        ));

        notification.expireTime ? 
            setTimeout(
                dispatch,
                notification.expireTime*1000,
                setRemoveNotification(notificationId)
            )
            : null;
    };
export const setNotification = (props: INotificationProps, notificiationId: string): IStoreNotificationAction => {
    return {
        type: NotificationActionTypes.ADD_NOTIFICATION, 
        payload: {...props, id: notificiationId}
    };
};
export interface IStoreNotificationAction extends Action<NotificationActionTypes> {
    payload: INotificationState;
}

//Remove Notification
export const removeNotificationAction = (id: string) => 
    (dispatch: Dispatch<IRemoveNotificationAction>): void => {
        dispatch(setRemoveNotification(
            id
        ));
    };
export const setRemoveNotification = (id: string): IRemoveNotificationAction => ({
    type: NotificationActionTypes.REMOVE_NOTIFICATION, payload: {
        id
    }
});
export interface IRemoveNotificationPayload {
    id: string
}
export interface IRemoveNotificationAction extends Action<NotificationActionTypes> {
    payload: IRemoveNotificationPayload
}