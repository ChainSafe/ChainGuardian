import * as React from "react";
import {useState} from "react";

export interface IDropdownProps {
    options: Array<string>;
    current: number;
    label?: string;
    onChange: (selected: number) => void;
}

export const Dropdown: React.FunctionComponent<IDropdownProps> = (props: IDropdownProps) => {
    const [visible, setVisible]=useState("none");

    function getSelectedIndex(clickedOption: string): number{
        return (props.options.findIndex(option => option === clickedOption));
    }
    function showHide(): void{
        visible === "none" ? setVisible("block") : setVisible("none");
    }
    function hide(): void{
        visible === "block" ? setVisible("none") : null;
    }
    
    return(
        <div>
            {props.label && <div className="label">{props.label}</div>}
            <div onClick={(): void=> hide()} className="dropdown-screen">
                <div className="dropdown-container">
                    <div onClick={(): void=> showHide()} className="dropdown-selected">
                        <div>{props.options[props.current]}</div>
                    </div>
                    <div className="dropdown-items">
                        {props.options.map(option =>{
                            return <div 
                                key={option} 
                                onClick={(): void => {props.onChange(getSelectedIndex(option));showHide();}} 
                                className={`dropdown-item 
                            ${visible}
                            ${getSelectedIndex(option)===props.current?"selected":""}`} 
                            >{option}</div>;
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};