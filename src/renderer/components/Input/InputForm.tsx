import * as React from "react";

export interface IInputFormProps {
    label?: string;
    valid?: boolean;
    errorMessage?: string;
    inputValue?: any;
    placeholder?: string;
    onChange?: (e: React.FormEvent<HTMLInputElement>) => void;
    focused?: boolean;
    inputId?: string;
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
                className={`inputform ${classNamesValid(props.valid)}`} 
                onChange={props.onChange} />
            <div 
                className={`error-message ${classNamesValid(props.valid)}`}>
                {props.valid === false && props.errorMessage}</div>
        </form>
    );
};