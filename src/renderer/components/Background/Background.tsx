import * as React from "react";
import logo from "../../assets/img/logo/Logo.svg";

interface IBackgroundProps {
    basic?: boolean;
    scrollable?: boolean;
    topBar?: any;
}

export const Background: React.FunctionComponent<React.PropsWithChildren<IBackgroundProps>> = (
    {
        children,
        basic,
        scrollable,
        topBar,
    }) => ( basic ?
    <div className={`background${scrollable ? " scrollable-y" : ""}`}>
        <div className={"top"}>
            <img className="logo" src={logo} />
            {topBar ? topBar : <DefaultTopBar />}
        </div>
        <div className="children">{children}</div>
    </div> 
    : 
    <div className="background">
        <div className={`illustration${scrollable ? " scrollable-y" : ""}`} >
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
