import {Horizontal, Vertical} from "../../components/Notification/NotificationEnums";

/** Only bottom right notifications are stacked one above another */
export const isStackedNotification = (horizontal: Horizontal, vertical: Vertical): boolean => {
    return horizontal === Horizontal.RIGHT && vertical === Vertical.BOTTOM;
};