import * as React from 'react';

interface Props {
    type: string;
    children: any;
}

export const Button: React.FunctionComponent<Props> = ({ type, children, ...props }) => (
    <button className={`button btn-${type}`} {...props}>
        {children}
    </button>
);
