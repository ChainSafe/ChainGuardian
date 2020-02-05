import {Horizontal, Vertical} from "../../components/Notification/NotificationEnums";

/** Only bottom right notifications are stacked one above another */
export const isStackedNotification = (horizontal: Horizontal, vertical: Vertical): boolean => {
    if(horizontal===Horizontal.RIGHT && vertical===Vertical.BOTTOM) return true;
    else return false;
};