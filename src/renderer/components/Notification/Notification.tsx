import * as React from "react";

export interface INotificationProps{
    isVisible: boolean;
    level: "info" | "error" | string;
    horizontalPosition?: "left" | "right" | "center";
    verticalPosition?: "top" | "bottom" | "center";
    children?: any;
    title?: string;
}

export const Notification: React.FunctionComponent<React.PropsWithChildren<INotificationProps>> = (
    props: INotificationProps) => (
    <div className={`notification-container ${props.level} ${props.isVisible ? "visible":"none"}`}>
        <span className="top-edge"></span>
        <div className="notification-title">
            <div>{props.title}</div>
            <div className="close-icon" />
        </div>
        <div className="notification-content">
            {props.children}
        </div>
    </div>
);