import {IRootState} from "../reducers";
import {INotificationStateObject} from "./slice";

export const getNotifications = (state: IRootState): INotificationStateObject => state.notificationArray;
