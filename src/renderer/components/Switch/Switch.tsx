import React from "react";
import ReactSwitch from "react-switch";

interface IProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    offLabel?: string;
    onLabel?: string;
}

export const Switch: React.FC<IProps> = ({checked, onChange, offLabel = "", onLabel = ""}) => (
    <div className='switch-container'>
        <p>{offLabel}</p>
        <ReactSwitch
            checked={checked}
            onChange={onChange}
            onHandleColor='#86d3ff'
            offHandleColor='#86d3ff'
            handleDiameter={30}
            uncheckedIcon={false}
            checkedIcon={false}
            boxShadow='0px 1px 5px rgba(0, 0, 0, 0.6)'
            activeBoxShadow='0px 0px 1px 10px rgba(0, 0, 0, 0.2)'
            height={20}
            width={48}
        />
        <p>{onLabel}</p>
    </div>
);
