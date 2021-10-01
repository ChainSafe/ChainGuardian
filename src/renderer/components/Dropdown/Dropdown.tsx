import * as React from "react";
import {ReactNode, useState} from "react";
import cgLogo from "../../assets/ico/app_icon.png";

export interface IDropdownProps {
    options: Array<string> | {[id: number]: string};
    current: number;
    label?: string;
    onChange?: (selected: number) => void;
    verifiedIndex?: number;
    className?: string;
}

export const Dropdown: React.FunctionComponent<IDropdownProps> = ({
    options,
    current,
    label,
    onChange,
    verifiedIndex,
    className = "",
}) => {
    const [visible, setVisible] = useState("none");
    // eslint-disable-next-line no-param-reassign
    options = Array.isArray(options) ? {...options} : options;

    function showHide(): void {
        visible === "none" ? setVisible("block") : setVisible("none");
    }

    function hide(): void {
        visible === "block" ? setVisible("none") : null;
    }

    function onOptionClick(key: number): void {
        if (onChange) {
            onChange(key);
            showHide();
        }
    }

    function renderOption(key: number): ReactNode {
        return (
            <div
                key={options[key]}
                onClick={(): void => onOptionClick(key)}
                className={`dropdown-item
                ${visible}
                ${key === current ? "selected" : ""}`}>
                {options[key]}
                {verifiedIndex === key && <img alt='ChainGuardian Logo' src={cgLogo} />}
            </div>
        );
    }

    return (
        <div className={className}>
            {label && <h3>{label}</h3>}
            <div onClick={(): void => hide()} className='dropdown-screen'>
                <div className='dropdown-container'>
                    <div onClick={(): void => onChange && showHide()} className='dropdown-selected'>
                        <div>{options[current]}</div>
                    </div>
                    <div className='dropdown-items-container'>
                        <div className='dropdown-items'>
                            {Object.keys(options)
                                .map((v) => parseInt(v))
                                .map((key) => renderOption(key))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
