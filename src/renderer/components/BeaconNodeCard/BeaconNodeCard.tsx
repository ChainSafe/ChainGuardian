import React from "react";

interface IBeaconNodeCardProps {
    logo: string;
    name: string;
    ribbon?: string;
    className?: string;
}

export const BeaconNodeCard: React.FC<IBeaconNodeCardProps> = ({logo, name, ribbon, className}) => {
    return (
        <div className={"beacon-node-card" + (className ? " " + className : "")}>
            {ribbon && (
                <div className='ribbon_wrapper'>
                    <div className='ribbon'>{ribbon}</div>
                </div>
            )}
            <img src={logo} alt={name} />
        </div>
    );
};
