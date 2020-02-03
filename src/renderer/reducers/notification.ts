import {IStoreNotificationAction, IRemoveNotificationAction} from "../actions/notification";
import {NotificationActionTypes} from "../constants/action-types";
import {Action} from "redux";
import {Level, Horizontal, Vertical} from "../components/Notification/NotificationEnums";

export interface INotificationState {
    isVisible: boolean,
    title: string,
    content: string,
    level: Level,
    horizontalPosition: Horizontal,
    verticalPosition: Vertical
}

export interface INotificationStateObject {
    stacked: Array<INotificationState>,
    other: Array<INotificationState>
}

const initialState: INotificationStateObject = {
    stacked: [],
    other: []
};

export const notificationReducer = (
    state = initialState, 
    action: Action<NotificationActionTypes>): INotificationStateObject => {

    // Copy of current notification state arrays
    const newStackedArray = state.stacked.slice();
    const newOtherArray = state.other.slice();

    switch (action.type) {
        case NotificationActionTypes.ADD_NOTIFICATION: {
            const actionProps = (action as IStoreNotificationAction).payload;

            if(actionProps.horizontalPosition===Horizontal.RIGHT && actionProps.verticalPosition===Vertical.BOTTOM) {
                newStackedArray.push(actionProps);
            } else {
                newOtherArray.push(actionProps);
            }

            return Object.assign({}, {
                stacked: newStackedArray,
                other: newOtherArray
            });
        }
            
        case NotificationActionTypes.REMOVE_NOTIFICATION: {
            const actionProps = (action as IRemoveNotificationAction).payload;

            if(actionProps.stackedArray) {
                newStackedArray.splice(actionProps.index, 1);}
            else {
                newOtherArray.splice(actionProps.index, 1);}

            return Object.assign({}, {
                stacked: newStackedArray,
                other: newOtherArray
            });
        }
            
        default:
            return state;
    }
};