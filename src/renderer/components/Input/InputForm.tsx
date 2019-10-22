import * as React from "react";
import {useState} from "react";

export interface IInputFormProps {
    label?: string;
    valid?: boolean;
    errorMessage?: string;
    inputValue?: string;
    placeholder?: string;
}

export const InputForm: React.FunctionComponent<IInputFormProps> = (props: IInputFormProps) => {
    const [input, setInput] = useState("");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setInput(e.currentTarget.value);
        props.inputValue = input;
    };

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
                placeholder={props.placeholder}
                value={props.inputValue}
                className={`inputform ${classNamesValid(props.valid)}`} 
                onChange={handleInputChange} />
            <div 
                className={`error-message ${(classNamesValid(props.valid) !== "error") ? "none" : "" }`}>
                {props.errorMessage}</div>
        </form>
    );
};