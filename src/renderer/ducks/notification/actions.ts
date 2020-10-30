import {createAction} from "@reduxjs/toolkit";
import {notificationSlice} from "./slice";
import {INotificationProps} from "../../reducers/notification";

export const {addNotification, removeNotification} = notificationSlice.actions;

export const createNotification = createAction<INotificationProps>("notification/createNotification");
