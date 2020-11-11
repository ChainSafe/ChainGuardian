import * as React from "react";

export interface IButtonProps {
    focused?: boolean;
    disabled?: boolean;
    onClick?: () => void;
    large?: boolean;
    buttonId?: string;
    datafield?: string | number;
    type?: "reset" | "button" | "submit";
    className?: string;
}
export interface IBaseButtonProps extends IButtonProps {
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
    large,
    buttonId,
    className,
    ...props
}) => (
    <button
        id={buttonId}
        className={`button btn-${buttonType} ${focused ? "focused" : ""} ${className || ""}`}
        disabled={disabled}
        onClick={onClick}
        {...props}>
        <div className={`${large ? "div-large" : ""}`}>{children}</div>
    </button>
);

function getButton(props: React.PropsWithChildren<IBaseButtonProps>, type: TYPES): React.ReactElement {
    return <BaseButton buttonType={type} {...props} />;
}

export const ButtonPrimitive: React.FunctionComponent<React.PropsWithChildren<IButtonProps>> = (props) => {
    return getButton(props, TYPES.PRIMITIVE);
};

export const ButtonPrimary: React.FunctionComponent<React.PropsWithChildren<IButtonProps>> = (props) => {
    return getButton(props, TYPES.PRIMARY);
};

export const ButtonSecondary: React.FunctionComponent<React.PropsWithChildren<IButtonProps>> = (props) => {
    return getButton(props, TYPES.SECONDARY);
};

export const ButtonInverted: React.FunctionComponent<React.PropsWithChildren<IButtonProps>> = (props) => {
    return getButton(props, TYPES.INVERTED);
};

export const ButtonDestructive: React.FunctionComponent<React.PropsWithChildren<IButtonProps>> = (props) => {
    return getButton(props, TYPES.DESTRUCTIVE);
};
