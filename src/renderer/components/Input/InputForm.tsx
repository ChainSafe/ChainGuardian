import * as React from "react";
import {useEffect, useRef} from "react";

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
    onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
    focused?: boolean;
    readOnly?: boolean;
    inputId?: string;
    type?: string;
    eye?: boolean;
    eyeSlash?: boolean;
    onEyeClick?: () => void;
    inputLabel?: string;
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

    const inputRef = useRef<HTMLInputElement>();
    const labelValueRef = useRef<HTMLInputElement>();
    useEffect(() => {
        if (inputRef.current && labelValueRef.current) {
            const {width} = labelValueRef.current.getBoundingClientRect();
            if (width > 0) {
                labelValueRef.current.style.paddingLeft = "15px";
                inputRef.current.style.paddingLeft = `${21 + width}px`;
                labelValueRef.current.style.marginRight = `-${width + 15}px`;
            }
        }
    }, [inputRef, labelValueRef]);

    return (
        <form onSubmit={props.onSubmit}>
            <div className='label'>{props.label}</div>
            <div className='inputform-container'>
                <div ref={labelValueRef} className='input-label'>
                    {props.inputLabel}
                </div>
                <input
                    ref={inputRef}
                    id={props.inputId}
                    autoFocus={props.focused}
                    placeholder={props.placeholder}
                    value={props.inputValue}
                    readOnly={props.readOnly}
                    className={`inputform ${classNamesValid(props.valid)}`}
                    onChange={props.onChange}
                    onFocus={props.onFocus}
                    type={props.type}
                />
                <div className={handleEyeStyle(props.eye, props.eyeSlash)} onClick={props.onEyeClick} />
            </div>
            <div className={"error-message"}>{props.valid === false && props.errorMessage}</div>
        </form>
    );
};
