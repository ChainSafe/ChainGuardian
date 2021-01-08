import React from "react";

interface ICheckboxProps {
    checked: boolean;
    onClick?: () => void;
    label?: string;
    id?: string;
}

export const CheckBox: React.FC<ICheckboxProps> = ({onClick = (): void => {}, checked, label = "", id = "chk"}) => (
    <>
        <input className='checkbox' type='checkbox' id={id} checked={checked} onChange={onClick} />
        <label htmlFor={id}>{label}</label>
    </>
);
