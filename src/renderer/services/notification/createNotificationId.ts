import {INotificationProps} from "../../reducers/notification";

export const createNotificationId = (notification: INotificationProps): string => {
    const randNum = (Math.floor((Math.random()*90000))+10000);

    return(
        `${notification.source}_${randNum}`
    );
};