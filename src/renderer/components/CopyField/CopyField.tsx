import * as React from "react";
import {CopyButton} from "../Button/ButtonAction";
import { clipboard } from "electron";

export interface ICopyFieldProps {
    value: string;
    label?: string;
    onCopy?: () => void;
}

export const CopyField: React.FunctionComponent<ICopyFieldProps> = (
    props: ICopyFieldProps) => {
    
    let copyToClipboard = () => {clipboard.writeText(props.value)};
    if(props.onCopy){
        copyToClipboard = props.onCopy;
    }

    return(
        <>
            <div className="label">{props.label}</div>
            <div className="copy-field">
                <div className="copy-field-body">{props.value}</div>
                <CopyButton onClick={copyToClipboard}/>
            </div>
        </>
    );
};


export const MnemonicCopyField: React.FunctionComponent<ICopyFieldProps> = (
    props: ICopyFieldProps) => {
    return(
        <div className="copy-field mnemonic">
            {props.value}
            <CopyButton onClick={props.onCopy}/>
        </div>
    );
};