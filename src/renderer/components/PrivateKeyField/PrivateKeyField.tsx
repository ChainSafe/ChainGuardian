import * as React from "react";
import {InputForm, IInputFormProps} from "../Input/InputForm"
import {useState, useEffect} from "react";
import {PasswordPrompt} from "../Prompt/PasswordPrompt";
import {ISubmitStatus} from "../Prompt/InputPrompt";

export interface IPrivateKeyProps extends IInputFormProps {

}

export const PrivateKeyField: React.FunctionComponent<IPrivateKeyProps> = (props: IPrivateKeyProps) => {
    const[showPrompt,setShowPrompt]=useState(false);
    const[password, setPassword]=useState(props.placeholder);
    const[timeoutStatus, setTimeoutStatus]=useState(false);
    const[passwordType, setPasswordType]=useState("password");

    const handlePromptSubmit = (promptPassword): ISubmitStatus => {
        if(promptPassword===password){
            setTimeoutStatus(true);
            setPasswordType("text");
            return {valid: true}
        } else {
            return {
                valid: false,
                errorMessage: "Invalid password"
            }
        }
    }

    const handleCancel = (): void => {

        setShowPrompt(false);
    }

    useEffect(()=>{
        setPassword(props.inputValue);

        if(timeoutStatus){
            setTimeout(setShowPrompt,1000,false);
        }
    },[timeoutStatus])

    return(
        <>
            <PasswordPrompt
                display={showPrompt}
                onSubmit={handlePromptSubmit}
                onCancel={(): void=>setShowPrompt(false)}
                
            />
            <InputForm
                label={props.label}
                valid={props.valid}
                errorMessage={props.errorMessage}
                inputValue={props.inputValue}
                placeholder={props.placeholder}
                // onChange={handleChange}
                onChange={props.onChange}
                onSubmit={(e): void => {e.preventDefault();props.onSubmit}}
                focused={props.focused}
                readOnly={props.readOnly}
                inputId={props.inputId}
                type={passwordType}
                eye={true}
                onEyeClick={(): void=>{setShowPrompt(true)}}
            />
        </>
    );
}