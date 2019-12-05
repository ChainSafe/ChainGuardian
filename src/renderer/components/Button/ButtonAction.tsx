import React from "react";
import arrow from "../../assets/img/buttons/Backtab.svg";
import add from "../../assets/img/buttons/Add.svg";
import copyDefault from "../../assets/img/buttons/CopyDefault.svg";

export interface IActionButtonProps {
    onClick?: () => void;
}

export const BackTab: React.FunctionComponent<IActionButtonProps> = ({onClick}) => {
    return(<button 
        className={"back-tab"} 
        onClick={onClick}>
        <img className={"icon"} src={arrow} />
    </button>);
};

export const CopyButton: React.FunctionComponent<IActionButtonProps> = ({onClick}) => {
    return(<button
        className={"copy-button"} 
        onClick={onClick}>
        <img data-tip="Copy all" data-place="top" className={"icon copy"} src={copyDefault} />
    </button>);
};

export const AddButton: React.FunctionComponent<IActionButtonProps> = ({onClick}) => {
    return(<button 
        className={"add-button"} 
        onClick={onClick}>
        <img className={"icon"} src={add} />
    </button>);
};

export const BackButton: React.FunctionComponent<IActionButtonProps> = ({onClick}) => {
    return(<button 
        className={"back-button"} 
        onClick={onClick}>
        <img className={"icon"} src={arrow} />
    </button>);
};

