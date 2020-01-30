import {IStoreNotificationAction} from "../actions/notification";
import {NotificationActionTypes} from "../constants/action-types";
import {Action} from "redux";
import {Level, Horizontal, Vertical} from "../components/Notification/NotificationEnums"

export interface INotificationState {
        isVisible: boolean,
        title: string,
        content: string,
        level: Level,
        horizontalPosition: Horizontal,
        verticalPosition: Vertical
}

const initialState: Array<INotificationState> = [];

export const notificationReducer = (
    state = initialState, 
    action: Action<NotificationActionTypes>): Array<INotificationState> => {

    switch (action.type) {
        case NotificationActionTypes.ADD_NOTIFICATION:
            const actionProps = (action as IStoreNotificationAction).payload;

            let newArray = state.slice();
            newArray.push(actionProps);
            return newArray;
            
        default:
            return state;
    }
};