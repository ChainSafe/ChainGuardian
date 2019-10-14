import * as React from "react";
// import { ReactComponent as Arrow } from './Icon/Vectorbacktab-1.svg';
import arrow from "./Icon/Backtab.svg";
import add from "./Icon/Add.svg";
import copyDefault from "./Icon/CopyDefault.svg";
import copyAll from "./Icon/CopyAll.svg";
import copied from "./Icon/Copied.svg";

export interface IProps {
    onClick?: () => {};
}

export const BackTab: React.FunctionComponent<IProps> = ({onClick}) => {
    return(<button 
        className={"back-tab"} 
        onClick={onClick}>
        <img className={"icon"} src={arrow} />
    </button>);
};

export const CopyButton: React.FunctionComponent<IProps> = ({onClick}) => {
    return(<button 
        className={"copy-button"} 
        onClick={onClick}>
        <img className={"icon copy"} src={copyDefault} />
        <img className={"icon copyall"} src={copyAll} />
        <img className={"icon copied"} src={copied} />
    </button>);
};

export const AddButton: React.FunctionComponent<IProps> = ({onClick}) => {
    return(<button 
        className={"add-button"} 
        onClick={onClick}>
        <img className={"icon"} src={add} />
    </button>);
};

export const BackButton: React.FunctionComponent<IProps> = ({onClick}) => {
    return(<button 
        className={"back-button"} 
        onClick={onClick}>
        <img className={"icon"} src={arrow} />
    </button>);
};

