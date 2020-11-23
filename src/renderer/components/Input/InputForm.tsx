import * as React from "react";

export interface IInputFormProps {
    label?: string;
    valid?: boolean;
    errorMessage?: string;
    inputValue?: string;
    placeholder?: string;
    onChange?: (e: React.FormEvent<HTMLInputElement>) => void;
    /**
     * Call e.preventDefault() for disabling submit on enter.
     *
     * @param e - form event
     */
    onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
    focused?: boolean;
    readOnly?: boolean;
    inputId?: string;
    type?: string;
    eye?: boolean;
    eyeSlash?: boolean;
    onEyeClick?: () => void;
    disabled?: boolean;
    centered?: boolean;
}

export const InputForm: React.FunctionComponent<IInputFormProps> = (props: IInputFormProps) => {
    const classNamesValid = (props: boolean | undefined): string => {
        switch (props) {
            case undefined:
                return "";
            case true:
                return "success";
            case false:
                return "error";
        }
    };

    const handleEyeStyle = (eyeTrue: boolean | undefined, eyeSlashed: boolean | undefined): string => {
        const value = eyeTrue ? "" : "none";
        const eyeType = eyeSlashed ? "input-eye-slash" : "input-eye";
        return eyeType + " " + value;
    };

    return (
        <form onSubmit={props.onSubmit}>
            <div className='label'>{props.label}</div>
            <div className='inputform-container'>
                <input
                    id={props.inputId}
                    autoFocus={props.focused}
                    placeholder={props.placeholder}
                    value={props.inputValue}
                    readOnly={props.readOnly}
                    className={`inputform ${classNamesValid(props.valid)} ${props.centered ? "centered" : ""}`}
                    onChange={props.onChange}
                    type={props.type}
                    disabled={props.disabled}
                />
                <div className={handleEyeStyle(props.eye, props.eyeSlash)} onClick={props.onEyeClick} />
            </div>
            <div className={"error-message"}>{props.valid === false && props.errorMessage}</div>
        </form>
    );
};
