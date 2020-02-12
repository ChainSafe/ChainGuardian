import * as React from "react";
import {useState} from "react";

export interface IDropdownProps {
    options: Array<string> | {[id: number]: string};
    current: number;
    label?: string;
    onChange?: (selected: number) => void;
}

export const Dropdown: React.FunctionComponent<IDropdownProps> = (props: IDropdownProps) => {
    const [visible, setVisible]=useState("none");

    const options = Array.isArray(props.options) ? {...props.options} : props.options;

    function showHide(): void{
        visible === "none" ? setVisible("block") : setVisible("none");
    }

    function hide(): void{
        visible === "block" ? setVisible("none") : null;
    }

    function onClick(key: number): void {
        const { onChange } = props;
        if (onChange) {
            onChange(key);
            showHide();
        }
    }

    function renderOption(key: number): any {
        return <div
            key={options[key]}
            onClick={(): void => onClick(key)}
            className={
                `dropdown-item
                ${visible}
                ${key === props.current ? "selected" : ""}`
            }>
            {options[key]}</div>;
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
                            {
                                Object.keys(options)
                                    .map(v => parseInt(v))
                                    .map(key => renderOption(key))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
