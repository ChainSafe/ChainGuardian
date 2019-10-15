import * as React from "react";

export interface IButtonProps {
    focused?: boolean;
    disabled?: boolean;
    onClick?: () => {};
}
export interface IBaseButtonProps extends IButtonProps{
    buttonType?: string;
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

function getButton(props: React.PropsWithChildren<IBaseButtonProps>, type: TYPES ): React.ReactElement {
    return(
        <BaseButton
            disabled={props.disabled}
            focused={props.focused}
            onClick={props.onClick}
            buttonType={type}
        >{props.children}
        </BaseButton>
    );
}

export const ButtonPrimitive: 
React.FunctionComponent<React.PropsWithChildren<IButtonProps>> = (props) => {
    return(
        getButton(props, TYPES.PRIMITIVE)
    );
};

export const ButtonPrimary:
React.FunctionComponent<React.PropsWithChildren<IButtonProps>> = (props) => {
    return(
        getButton(props, TYPES.PRIMARY)
    );
};

export const ButtonSecondary:
React.FunctionComponent<React.PropsWithChildren<IButtonProps>> = (props) => {
    return(
        getButton(props, TYPES.SECONDARY)
    );
};

export const ButtonInverted:
React.FunctionComponent<React.PropsWithChildren<IButtonProps>> = (props) => {
    return(
        getButton(props, TYPES.INVERTED)
    );
};

export const ButtonDestructive:
React.FunctionComponent<React.PropsWithChildren<IButtonProps>> = (props) => {
    return(
        getButton(props, TYPES.DESTRUCTIVE)
    );
};