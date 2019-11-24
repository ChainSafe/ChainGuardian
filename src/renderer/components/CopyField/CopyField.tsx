import * as React from "react";
import {CopyButton} from "../Button/ButtonAction";
import {clipboard} from "electron";

export interface ICopyFieldProps {
    value: string;
    label?: string;
    onCopy?: () => void;
}

export const CopyField: React.FunctionComponent<ICopyFieldProps> = (
    props: ICopyFieldProps) => {
    
    let copyToClipboard = (): void => {clipboard.writeText(props.value);};
    if(props.onCopy){
        copyToClipboard = props.onCopy;
    }

    return(
        <>
            <h3 className="copy-field-label">{props.label}</h3>
            <div className="copy-field">
                <CopyButton onClick={copyToClipboard}/>
                <div className="copy-field-body">{props.value}</div>
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