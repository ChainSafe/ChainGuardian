import * as React from "react";
import {CopyButton} from "../Button/ButtonAction";

export interface ICopyFieldProps {
    value: string;
    onCopy?: () => void;
}

export const CopyField: React.FunctionComponent<ICopyFieldProps> = (
    props: ICopyFieldProps) => {
    return(
        <div className="copy-field">
            {props.value}
            <CopyButton onClick={props.onCopy}/>
        </div>
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