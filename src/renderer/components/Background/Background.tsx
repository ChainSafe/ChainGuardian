import * as React from "react";
import logo from "../../assets/img/logo/Logo.svg";

interface IBackgroundProps {
    basic?: boolean;
    topBar?: any;
}

export const Background: React.FunctionComponent<React.PropsWithChildren<IBackgroundProps>> = ({
    children, 
    basic,
    topBar}) => ( basic ?
    <div className="background">
        <div className={"top"}>
            <img className="logo" src={logo} />
            {topBar ? topBar : <DefaultTopBar />}
        </div>
        <div className="children">{children}</div>
    </div> 
    : 
    <div className="background">
        <div className="illustration" >
            <div className={"top"}>
                <img className="logo" src={logo} />
                {topBar ? topBar : <DefaultTopBar />}
            </div>
            <div className="children">{children}</div>
        </div>
    </div>
);

const DefaultTopBar: React.FunctionComponent = () => (
    <span className="background-top-bar"></span>
);
