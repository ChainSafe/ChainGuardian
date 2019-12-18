import * as React from "react";

export interface IInputFormProps {
    label?: string;
    valid?: boolean;
    errorMessage?: string;
    inputValue?: string;
    placeholder?: string;
    onChange?: (e: React.FormEvent<HTMLInputElement>) => void;
    focused?: boolean;
    readOnly?: boolean;
    inputId?: string;
    type?: string;
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
        <form>
            <div className="label">{props.label}</div>
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
            <div 
                className={"error-message"}>
                {props.valid === false && props.errorMessage}</div>
        </form>
    );
};