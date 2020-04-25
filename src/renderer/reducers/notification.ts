import {IStoreNotificationAction, IRemoveNotificationAction} from "../actions/notification";
import {NotificationActionTypes} from "../constants/action-types";
import {Action} from "redux";
import {Level, Horizontal, Vertical} from "../components/Notification/NotificationEnums";
import {isStackedNotification} from "../services/notification/isStackedNotification";

export interface INotificationProps {
    /** history.location.pathname */
    source: string,
    isVisible?: boolean,
    title: string,
    content?: string,
    level?: Level,
    horizontalPosition?: Horizontal,
    verticalPosition?: Vertical,
    /** seconds */
    expireTime?: number
}
export interface INotificationState extends INotificationProps {
    horizontalPosition: Horizontal,
    verticalPosition: Vertical,
    level: Level,
    isVisible: boolean,
    id: string
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

    switch (action.type) {
        case NotificationActionTypes.ADD_NOTIFICATION: {
            const actionProps = (action as IStoreNotificationAction).payload;

            if(isStackedNotification(actionProps.horizontalPosition, actionProps.verticalPosition)) {
                const newStackedArray = state.stacked.slice();
                newStackedArray.push(actionProps);
                return Object.assign({}, {
                    stacked: newStackedArray,
                    other: state.other
                });
            } else {
                const newOtherArray = state.other.slice();
                newOtherArray.push(actionProps);
                return Object.assign({}, {
                    stacked: state.stacked,
                    other: newOtherArray
                });
            }
        }

        case NotificationActionTypes.REMOVE_NOTIFICATION: {
            const notificationId = (action as IRemoveNotificationAction).payload.id;
            let arrayIndex = 0;
            let stacked: boolean | undefined;

            state.stacked.forEach((n, i) => {
                if(n.id===notificationId){
                    arrayIndex = i;
                    stacked = true;
                }
            });
            state.other.forEach((n, i) => {
                if(n.id===notificationId) {
                    arrayIndex = i;
                    stacked = false;
                }
            });

            if(stacked){
                const newStackedArray = state.stacked.slice();
                newStackedArray.splice(arrayIndex,1);

                return Object.assign({}, {
                    stacked: newStackedArray,
                    other: state.other
                });
            } else {
                const newOtherArray = state.other.slice();
                newOtherArray.splice(arrayIndex,1);

                return Object.assign({}, {
                    stacked: state.stacked,
                    other: newOtherArray
                });
            }
        }

        default:
            return state;
    }
};
