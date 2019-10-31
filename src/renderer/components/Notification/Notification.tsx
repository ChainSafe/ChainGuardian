import * as React from "react";

export interface INotificationProps{
    isVisible: boolean;
    level: "info" | "error" | string;
    horizontalPosition?: "left" | "right" | "center-horizontal" | string;
    verticalPosition?: "top" | "bottom" | "center-vertical" | string;
    children?: any;
    title?: string;
    onClose: () => void;
}

export const Notification: React.FunctionComponent<React.PropsWithChildren<INotificationProps>> = (
    props: INotificationProps) => {
        
    return(
        <div className={`notification-container
        ${props.level} 
        ${props.isVisible ? "visible":"none"}
        ${props.horizontalPosition}
        ${props.verticalPosition}`}>
            <div className="notification-title">
                <div>{props.title}</div>
                <div onClick={(): void => props.onClose()} className="close-icon" />
            </div>
            <div className="notification-content">
                {props.children}
            </div>
        </div>
    );
};