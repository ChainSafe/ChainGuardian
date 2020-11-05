import {createAction} from "@reduxjs/toolkit";
import {INotificationProps, notificationSlice} from "./slice";

export const {addNotification, removeNotification} = notificationSlice.actions;

export const createNotification = createAction<INotificationProps>("notification/createNotification");
