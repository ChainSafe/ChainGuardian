import * as React from "react";

interface IProps {
    type: string;
    children: any;
}

export const Button: React.FunctionComponent<IProps> = ({type, children, ...props}) => (
    <button className={`button btn-${type}`} {...props}>
        {children}
    </button>
);
