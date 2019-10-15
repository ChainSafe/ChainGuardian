import * as React from "react";

interface IProps {
    children?: any;
}

export const Background: React.FunctionComponent<React.PropsWithChildren<IProps>> = ({children}) => (
    <div className="background">
        {children}
    </div>
);
