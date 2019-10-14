import * as React from "react";

export interface IButtonProps {
    focused?: boolean;
    disabled?: boolean;
    onClick?: () => {};
}
export interface IBaseButtonProps extends IButtonProps{
    buttonType: string;
}
enum TYPES {
    PRIMITIVE = "primitive",
    PRIMARY = "primary",
    SECONDARY = "secondary",
    INVERTED = "inverted",
    DESTRUCTIVE = "destructive",
}

const BaseButton: React.FunctionComponent<IBaseButtonProps> = ({
    children,
    disabled,
    focused,
    onClick,
    buttonType,
}) => (focused ? <button 
    className={`button btn-${buttonType} focused`} 
    disabled={disabled} 
    onClick={onClick}>
    {children}
</button> : <button 
    className={`button btn-${buttonType}`} 
    disabled={disabled} 
    onClick={onClick}>
    {children}
</button>);

export const ButtonPrimitive: 
React.FunctionComponent<React.PropsWithChildren<IButtonProps>> = ({
    children, disabled, focused, onClick}) => {
    return(<BaseButton 
        disabled={disabled}
        focused={focused}
        onClick={onClick}
        buttonType={TYPES.PRIMITIVE}>
        {children}</BaseButton>);
};

export const ButtonPrimary:
React.FunctionComponent<React.PropsWithChildren<IButtonProps>> = ({
    children, disabled, focused, onClick}) => {
    return(<BaseButton
        disabled={disabled}
        focused={focused}
        onClick={onClick}
        buttonType={TYPES.PRIMARY}>
        {children}</BaseButton>);
};

export const ButtonSecondary:
React.FunctionComponent<React.PropsWithChildren<IButtonProps>> = ({
    children, disabled, focused, onClick}) => {
    return(<BaseButton
        disabled={disabled}
        focused={focused}
        onClick={onClick}
        buttonType={TYPES.SECONDARY}>
        {children}</BaseButton>);
};

export const ButtonInverted:
React.FunctionComponent<React.PropsWithChildren<IButtonProps>> = ({
    children, disabled, focused, onClick}) => {
    return(<BaseButton
        disabled={disabled}
        focused={focused}
        onClick={onClick}
        buttonType={TYPES.INVERTED}>
        {children}</BaseButton>);
};

export const ButtonDestructive:
React.FunctionComponent<React.PropsWithChildren<IButtonProps>> = ({
    children, disabled, focused, onClick}) => {
    return(<BaseButton
        disabled={disabled}
        focused={focused}
        onClick={onClick}
        buttonType={TYPES.DESTRUCTIVE}>
        {children}</BaseButton>);
};