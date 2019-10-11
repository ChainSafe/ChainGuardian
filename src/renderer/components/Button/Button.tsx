import * as React from "react";

export interface IButtonProps {
    // type: string;
    // children: any;
    disabled?: boolean;
    onClick?: () => {};
}
export interface IBaseButtonProps extends IButtonProps{
    buttonType: string;
}
const TYPES = {
    PRIMITIVE: "primitive",
    PRIMARY: "primary",
    SECONDARY: "secondary",
    INVERTED: "inverted",
    DESTRUCTIVE: "destructive",
};

const BaseButton: React.FunctionComponent<IBaseButtonProps> = ({
    children,
    disabled,
    onClick,
    buttonType,
}) => (<button className={"button " + buttonType} disabled={disabled} onClick={onClick}>{children}</button>);

export const ButtonPrimitive: React.FunctionComponent<React.PropsWithChildren<IButtonProps>> = ({children, disabled, onClick}) => {
    return(<BaseButton disabled={disabled} onClick={onClick} buttonType={TYPES.PRIMITIVE}>{children}</BaseButton>);
    
};

