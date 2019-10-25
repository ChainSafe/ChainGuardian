import * as React from "react";
import {BackTab} from "../Button/ButtonAction";
export interface IModalProps {
    children?: any;
    hasBack?: boolean;
    onBack?: () => void;
    topBar?: any;
}

export const Modal: React.FunctionComponent<React.PropsWithChildren<IModalProps>> = (
    props: IModalProps) => (
    <div className="modal">
        {props.hasBack && <div className="backtab-position"><BackTab onClick={props.onBack} /></div>}
        <div className="modal-content">
            {props.topBar ? props.topBar : <DefaultTopBar />}
            <div className="modal-children">
                {props.children}
            </div>
        </div>
    </div>
);


const DefaultTopBar: React.FunctionComponent = () => (
    <span className="top-bar"></span>
);