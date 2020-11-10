import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Level, Vertical, Horizontal} from "../../components/Notification/NotificationEnums";
import {isStackedNotification} from "../../services/notification/isStackedNotification";

export interface INotificationProps {
    /** history.location.pathname */
    source: string;
    isVisible?: boolean;
    title: string;
    content?: string;
    level?: Level;
    horizontalPosition?: Horizontal;
    verticalPosition?: Vertical;
    /** seconds */
    expireTime?: number;
}

export interface INotificationState extends INotificationProps {
    horizontalPosition: Horizontal;
    verticalPosition: Vertical;
    level: Level;
    isVisible: boolean;
    id: string;
}

export interface INotificationStateObject {
    stacked: Array<INotificationState>;
    other: Array<INotificationState>;
}

const initialState: INotificationStateObject = {
    stacked: [],
    other: [],
};

export const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        addNotification: (state, action: PayloadAction<INotificationState>): void => {
            if (isStackedNotification(action.payload.horizontalPosition, action.payload.verticalPosition)) {
                state.stacked.push(action.payload);
            } else {
                state.other.push(action.payload);
            }
        },
        removeNotification: (state, action: PayloadAction<string>): void => {
            const stackedIndex = state.stacked.findIndex(({id}) => id == action.payload);
            if (stackedIndex !== -1) {
                state.stacked.splice(stackedIndex, 1);
                return; // uses as "break"
            }
            const otherIndex = state.other.findIndex(({id}) => id == action.payload);
            if (otherIndex !== -1) {
                state.stacked.splice(stackedIndex, 1);
            }
        },
    },
});
