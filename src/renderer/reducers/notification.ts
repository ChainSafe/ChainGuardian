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

export interface INotificationStateObject {
    stacked: Array<INotificationState>,
    other: Array<INotificationState>
}

const initialState: INotificationStateObject = {
    stacked: [],
    other: []
}

export const notificationReducer = (
    state = initialState, 
    action: Action<NotificationActionTypes>): INotificationStateObject => {

    switch (action.type) {
        case NotificationActionTypes.ADD_NOTIFICATION:
            const actionProps = (action as IStoreNotificationAction).payload;

            // Copy of current notification state
            let newStackedArray = state.stacked.slice();
            let newOtherArray = state.other.slice();

            if(actionProps.horizontalPosition===Horizontal.RIGHT && actionProps.verticalPosition===Vertical.BOTTOM) {
                newStackedArray.push(actionProps);
            } else {
                newOtherArray.push(actionProps);
            }

            return Object.assign({}, state, {
                stacked: newStackedArray,
                other: newOtherArray
            })
        default:
            return state;
    }
};