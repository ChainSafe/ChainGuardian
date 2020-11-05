import {put, delay, PutEffect, CallEffect, all, takeEvery} from "redux-saga/effects";
import {createNotificationId} from "../../services/notification/createNotificationId";
import {Horizontal, Level, Vertical} from "../../components/Notification/NotificationEnums";
import {removeNotification, addNotification, createNotification} from "./actions";

function* storeNotification({payload}: ReturnType<typeof createNotification>): Generator<PutEffect | CallEffect, void> {
    const notificationId = createNotificationId(payload);
    const notification = {
        isVisible: true,
        level: Level.ERROR,
        expireTime: 10,
        horizontalPosition: Horizontal.CENTER,
        verticalPosition: Vertical.TOP,
        ...payload,
        id: notificationId,
    };

    yield put(addNotification(notification));

    if (notification.expireTime) {
        yield delay(notification.expireTime * 1000);
        yield put(removeNotification(notificationId));
    }
}

export function* notificationSagaWatcher(): Generator {
    yield all([
        takeEvery(createNotification, storeNotification),
    ]);
}
