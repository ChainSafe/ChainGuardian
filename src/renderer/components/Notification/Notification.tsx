import * as React from "react";

export interface INotificationProps{
    isVisible: boolean;
    level: level;
    horizontalPosition?: horizontal;
    verticalPosition?: vertical;
    title?: string;
    children?: any;
    onClose: () => void;
}

export enum level {
    info = "info",
    error = "error",
}

export enum horizontal {
    left = "left",
    right = "right",
    center = "center-horizontal",
}

export enum vertical {
    top = "top",
    bottom = "bottom",
    center = "center-vertical",
}

export const Notification: React.FunctionComponent<React.PropsWithChildren<INotificationProps>> = (
    props: INotificationProps) => {
    
    function getClasses(props: INotificationProps): string {
        return `${props.level} 
        ${props.isVisible ? "visible":"none"} 
        ${props.horizontalPosition} 
        ${props.verticalPosition}`;
    }

    return(
        <div className={`notification-container
        ${getClasses(props)} `}>
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