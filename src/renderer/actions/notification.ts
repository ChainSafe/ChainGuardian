import {NotificationActionTypes} from "../constants/action-types";
import {Action, Dispatch} from "redux";
import {INotificationState, INotificationProps} from "../reducers/notification";
import {Horizontal, Vertical} from "../components/Notification/NotificationEnums";

export const createNotificationId = (notification: INotificationProps): string => {
    const level = notification.level.toUpperCase().slice(0,1);
    const horizontal = notification.horizontalPosition.toUpperCase().slice(0,1);
    const vertical = notification.verticalPosition.toUpperCase().slice(0,1);
    const title = notification.title.toUpperCase().slice(0,2);
    const content = notification.content.toUpperCase().slice(0,2);
    let expireTime = 0;
    if(notification.expireTime) expireTime = notification.expireTime;
    const randNum = (Math.floor((Math.random()*90000))+10000);
    return(
        `${level}_${horizontal}_${vertical}_${expireTime}_${title+content}_${randNum}`
    );
}

//Add Notification
/** expireTime is in seconds */
export const storeNotificationAction = (notification: INotificationProps) =>
    (dispatch: Dispatch<IStoreNotificationAction>): void => {
        let isStacked = false;
        if(notification.horizontalPosition===Horizontal.RIGHT 
            && notification.verticalPosition===Vertical.BOTTOM)
            isStacked = true;
        dispatch(setNotification( notification
        ));

        notification.expireTime ? 
            setTimeout(
                dispatch, 
                notification.expireTime*1000, 
                setRemoveNotification(0,isStacked)
                ) 
            : null;
    };
export const setNotification = (props: INotificationProps
): IStoreNotificationAction => {

    return {
        type: NotificationActionTypes.ADD_NOTIFICATION, 
        payload: {...props, id: createNotificationId(props)}
    }
};
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