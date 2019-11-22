import * as React from "react";
import logoWhiteLoading from "../../assets/img/logo/Logo_white_loading.svg";

interface ILoadingProps {
    visible?: boolean;
    title?: string;
}

export const Loading: React.FunctionComponent<React.PropsWithChildren<ILoadingProps>> = (
    props: React.PropsWithChildren<ILoadingProps>) => {
    return (
        <div className={`loading-container ${props.visible ? "":"none"}`}>
            <div className="loading title"><h1>{props.title}</h1></div>
            <div>{props.children}</div>
            <img className="loading-logo" src={logoWhiteLoading}/>
        </div>
    );
};
