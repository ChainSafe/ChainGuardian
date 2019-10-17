import * as React from "react";
import {useState} from "react";

export interface IInputFormProps {
    label?: string;
    valid?: boolean;
    errorMessage?: string;
    input?: string;
}

export const InputForm: React.FunctionComponent<IInputFormProps> = (props: IInputFormProps) => {
    const [input, setInput] = useState("");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.currentTarget.value);
    };

    const classNamesValid = (props: boolean | undefined) => {
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
                className={`inputform ${classNamesValid(props.valid)}`} 
                onChange={handleInputChange} />
            <div 
                className={`error-message ${(classNamesValid(props.valid) !== "error") ? "none" : "" }`}>
                {props.errorMessage}</div>
        </form>
    );
};