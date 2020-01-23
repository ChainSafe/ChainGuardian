import * as React from "react";
import {ButtonPrimary, ButtonDestructive} from "../Button/ButtonStandard";

export interface IConfirmModalProps {
    showModal: boolean
    question: string,
    subText?: string
    onOKClick: () => void;
    onCancelClick: () => void;
}

export const ConfirmModal: React.FunctionComponent<IConfirmModalProps> = (
    props: IConfirmModalProps) => {

    return (
        <div className={`confirmModalContainer ${props.showModal ? "" : "none"}`}>
            <div className="confirmModal">
                <h2>{props.question}</h2>
                <p>{props.subText}</p>
                <div className="confirmModalButtons">
                    <ButtonPrimary onClick={props.onOKClick}>Ok</ButtonPrimary>
                    <ButtonDestructive onClick={props.onCancelClick}>Cancel</ButtonDestructive>
                </div>
            </div>
        </div>
    );
};