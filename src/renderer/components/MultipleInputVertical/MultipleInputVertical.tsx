import * as React from "react";
import {IInputFormProps} from "../Input/InputForm";

export interface IMultipleFormProps {
    inputs: Array<IInputFormProps>;
}

export const MultipleInputVertical: React.FunctionComponent<IMultipleFormProps> = (props: IMultipleFormProps) => {

    const classNamesValid = (props: boolean | undefined): string => {
        switch(props) {
            case undefined : return("");
            case true : return("success");
            case false : return("error");
        }
    };

    return(
        <div className="form-vertical">
            {props.inputs.map((p, index) => {
                return <div key={index} className="inputrow-vertical">
                    <div className="label">{p.label}</div>
                    <input
                        id={p.inputId}
                        autoFocus={p.focused}
                        placeholder={p.placeholder}
                        value={p.inputValue}
                        className={`inputform inputform-vertical ${classNamesValid(p.valid)}`}
                        onChange={p.onChange}
                        type={"password"}
                    />
                    <div
                        className={"error-message error-message-wide"} id={`${p.inputId}-error`}>
                        {p.valid === false && p.errorMessage}</div>
                </div>;
            })}
        </div>
    );
};
