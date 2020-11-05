import {INotificationProps} from "../../ducks/notification/slice";

export const createNotificationId = (notification: INotificationProps): string => {
    const randNum = (Math.floor((Math.random()*90000))+10000);

    return(
        `${notification.source}_${randNum}`
    );
};