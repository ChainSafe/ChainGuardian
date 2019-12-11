import * as React from "react";
import {useState} from "react";

export interface IDropdownProps {
    options: Array<string> | {[id: number]: string};
    current: number;
    label?: string;
    onChange: (selected: number) => void;
}

export const Dropdown: React.FunctionComponent<IDropdownProps> = (props: IDropdownProps) => {
    const [visible, setVisible]=useState("none");

    function getSelectedIndex(clickedOption: string): number {
        if (Array.isArray(props.options)) {
            return (props.options.findIndex(option => option === clickedOption));
        } else {
            return parseInt(Object.keys(props.options)[Object.values(props.options).indexOf(clickedOption)]);
        }

    }
    function showHide(): void{
        visible === "none" ? setVisible("block") : setVisible("none");
    }
    function hide(): void{
        visible === "block" ? setVisible("none") : null;
    }
    
    return(
        <div>
            {props.label && <h3>{props.label}</h3>}
            <div onClick={(): void=> hide()} className="dropdown-screen">
                <div className="dropdown-container">
                    <div onClick={(): void=> showHide()} className="dropdown-selected">
                        <div>{props.options[props.current]}</div>
                    </div>
                    <div className="dropdown-items-container">
                        <div className="dropdown-items">
                            { Array.isArray(props.options) ?
                                // array of strings
                                props.options.map(option =>{
                                    return <div
                                        key={option}
                                        onClick={(): void => {props.onChange(getSelectedIndex(option));showHide();}}
                                        className={`dropdown-item 
                                    ${visible}
                                    ${getSelectedIndex(option)===props.current?"selected":""}`}
                                    >{option}</div>;}) :
                                // mapping object
                                Object.values(props.options).map(value => {
                                    return <div
                                        key={value}
                                        onClick={(): void => {props.onChange(getSelectedIndex(value));showHide();}}
                                        className={
                                            `dropdown-item
                                            ${visible}
                                            ${getSelectedIndex(value)===props.current?"selected":""}`}
                                    >{value}</div>;})
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
