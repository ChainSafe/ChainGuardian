import * as React from "react";
import {BackTab} from "../Button/ButtonAction";
export interface IModalProps {
    children?: any;
    hasBack?: boolean;
    onBack?: () => void;
}

export const Modal: React.FunctionComponent<React.PropsWithChildren<IModalProps>> = (
    props: IModalProps) => (
    props.hasBack ? 
        <div className="modal">
            <div className="backtab-position"><BackTab onClick={props.onBack} /></div>
            <div className="modal-children">
                {props.children}
            </div>
        </div>
        : 
        <div className="modal">
            <div className="modal-children">
                {props.children}
            </div>
        </div>
);
