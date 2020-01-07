import * as React from "react";
import eyeIcon from "../../assets/img/input/eye-regular.svg"

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
    onEyeClick?: () => void;
}

export const InputForm: React.FunctionComponent<IInputFormProps> = (props: IInputFormProps) => {
    
    const classNamesValid = (props: boolean | undefined): string => {
        switch(props) {
            case undefined : return("");
            case true : return("success");
            case false : return("error");
        }
    };
    return( 
        <form onSubmit={props.onSubmit}>
            <div className="label">{props.label}</div>
            <div className="input-container">
                <input
                    id={props.inputId}
                    autoFocus={props.focused}
                    placeholder={props.placeholder}
                    value={props.inputValue}
                    readOnly={props.readOnly}
                    className={`inputform ${classNamesValid(props.valid)}`} 
                    onChange={props.onChange}
                    type={props.type}
                />
                <img 
                    className={`input-eye ${props.eye? "" : "none"}`}
                    src={eyeIcon} 
                    onClick={props.onEyeClick}
                />
            </div>
            <div 
                className={"error-message"}>
                {props.valid === false && props.errorMessage}</div>
        </form>
    );
};