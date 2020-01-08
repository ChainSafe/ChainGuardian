import * as React from "react";
import {InputForm, IInputFormProps} from "../Input/InputForm";
import {useState, useEffect} from "react";
import {PasswordPrompt} from "../Prompt/PasswordPrompt";
import {ISubmitStatus} from "../Prompt/InputPrompt";

export interface IPrivateKeyProps extends IInputFormProps {
    password: string;
}
export const PrivateKeyField: React.FunctionComponent<IPrivateKeyProps> = (props: IPrivateKeyProps) => {
    const[showPrompt,setShowPrompt]=useState<boolean>(false);
    const[privateKey/*, setPrivateKey **/]=useState<string | undefined>(props.inputValue);
    const[timeoutStatus, setTimeoutStatus]=useState<boolean>(false);
    const[passwordType, setPasswordType]=useState<string>("password");

    const handlePromptSubmit = (promptPassword: string): ISubmitStatus => {
        if(promptPassword===props.password){
            setTimeoutStatus(true);
            setPasswordType("text");
            return {valid: true};
        } else {
            return {
                valid: false,
                errorMessage: "Invalid password"
            };
        }
    };

    useEffect(()=>{
        if(timeoutStatus){
            setTimeout(setShowPrompt,400,false);
        }
    },[timeoutStatus]);

    return(
        <>
            <PasswordPrompt
                display={showPrompt}
                onSubmit={handlePromptSubmit}
                onCancel={(): void=>{setShowPrompt(false);}}
            />
            <InputForm
                label={props.label}
                valid={props.valid}
                errorMessage={props.errorMessage}
                inputValue={privateKey}
                placeholder={props.placeholder}
                // onChange={(e): void => {setPrivateKey(e.currentTarget.value);props.onChange}}
                onSubmit={(e): void => {e.preventDefault();props.onSubmit;}}
                focused={props.focused}
                readOnly={props.readOnly}
                inputId={props.inputId}
                type={passwordType}
                eye={true}
                onEyeClick={(): void => {setShowPrompt(true);}}
            />
        </>
    );
};