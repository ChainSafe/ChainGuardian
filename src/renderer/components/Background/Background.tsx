import * as React from "react";
import logo from "../../assets/img/logo/Logo.svg";

interface IBackgroundProps {
    basic?: boolean;
}

export const Background: React.FunctionComponent<React.PropsWithChildren<IBackgroundProps>> = ({
    children, 
    basic}) => ( basic ? 
    <div className="background">
        <img className="logo" src={logo} />
        <div className="children">{children}</div>
    </div> 
    : 
    <div className="background">
        <div className="illustration" >
            <img className="logo" src={logo} />
            <div className="children">{children}</div>
        </div>
    </div>
);
