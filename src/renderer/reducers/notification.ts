import {IStoreNotificationAction} from "../actions/notification";
import {NotificationActionTypes} from "../constants/action-types";
import {Action} from "redux";
import {Level, Horizontal, Vertical} from "../components/Notification/NotificationEnums"

export interface INotificationState {
    notificationArray: Array<{
        isVisible: boolean,
        title: string,
        content: string,
        level: Level,
        horizontalPosition: Horizontal,
        verticalPosition: Vertical
    }>
}

const initialState: INotificationState = {
    notificationArray: []
};

export const notificationReducer = (
    state = initialState, 
    action: Action<NotificationActionTypes>): INotificationState => {

    switch (action.type) {
        case NotificationActionTypes.ADD_NOTIFICATION:

            return Object.assign({}, state, {
                notification: [...state.notificationArray, (action as IStoreNotificationAction).payload.notification]

                // notification: (action as IStoreNotificationAction).payload.notification
            });
                
            // return state.notificationArray.concat((action as IStoreNotificationAction).payload.notification);
            
        default:
            return state;
    }
};