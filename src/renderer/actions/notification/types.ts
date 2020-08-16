import {INotificationState} from "../../reducers/notification";

export enum NotificationActionTypes {
    ADD_NOTIFICATION = "ADD_NOTIFICATION",
    REMOVE_NOTIFICATION = "REMOVE_NOTIFICATION"
}

export interface IRemoveNotificationPayload {
    id: string
}
export type RemoveNotificationAction = {
    type: typeof NotificationActionTypes.REMOVE_NOTIFICATION,
    payload: {
        id: string
    }
};

export type StoreNotificationAction = {
    type: typeof NotificationActionTypes.ADD_NOTIFICATION;
    payload: INotificationState;
};

export type NotificationAction = RemoveNotificationAction | StoreNotificationAction;
