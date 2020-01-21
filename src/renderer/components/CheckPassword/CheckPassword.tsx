import * as React from "react";
import {useState, useEffect} from "react";
import {PasswordPrompt, IPasswordPromptProps} from "../Prompt/PasswordPrompt";
import {ISubmitStatus} from "../Prompt/InputPrompt";
import database from "../../services/db/api/database";
import {DEFAULT_ACCOUNT} from "../../constants/account";

export interface ICheckPasswordProps {
    showPrompt: boolean;
    onCorrectPassword: () => void;
}

export const CheckPassword: React.FunctionComponent<ICheckPasswordProps> = (props: ICheckPasswordProps) => {
    const[showPrompt,setShowPrompt]=useState<boolean>(props.showPrompt);
    const[timeoutStatus, setTimeoutStatus]=useState<boolean>(false);
    const[password, setPassword]=useState<string>("");

    const handlePromptSubmit = async (promptPassword: string): Promise<ISubmitStatus> => {

        const accounts = await database.account.get(DEFAULT_ACCOUNT);
        if(accounts != null){
            const isCorrectValue = await accounts.isCorrectPassword(promptPassword);
            if(isCorrectValue){
                setTimeoutStatus(true);
                setPassword(promptPassword);
                return {valid: true};
            } else {
                return {
                    valid: false,
                    errorMessage: "Invalid password"
                };
            }
        } else{
            return {
                valid: false,
                errorMessage: "Error"
            };
        }
    };

    useEffect(()=>{
        if(timeoutStatus){
            setTimeout(setShowPrompt,400,false);
            props.onCorrectPassword();
        }
    },[timeoutStatus]);

    return(
        <PasswordPrompt
            display={showPrompt}
            onSubmit={handlePromptSubmit}
            onCancel={(): void=>{setShowPrompt(false);}}
        />
    );
};