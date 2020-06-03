import React from "react";
import {ICGKeystore} from "../../services/keystore";
import {InputForm, IInputFormProps} from "../Input/InputForm";
import {useState} from "react";
import {PasswordPrompt} from "../Prompt/PasswordPrompt";
import {ISubmitStatus} from "../Prompt/InputPrompt";
import database from "../../services/db/api/database";
import {DEFAULT_ACCOUNT} from "../../constants/account";

interface IPrivateKeyFieldProps extends IInputFormProps {
    keystore: ICGKeystore;
}

export const PrivateKeyField: React.FunctionComponent<IPrivateKeyFieldProps> = (props: IPrivateKeyFieldProps) => {
    const [showPrompt,setShowPrompt] = useState<boolean>(false);
    const [passwordType, setPasswordType] = useState<string>("password");
    const [eyeSlash, setEyeSlash] = useState<boolean>(false);
    const [privateKey, setPrivateKey] = useState<string>("encrypted");

    const handlePromptSubmit = async (promptPassword: string): Promise<ISubmitStatus> => {
        const account = await database.account.get(DEFAULT_ACCOUNT);
        if (account != null) {
            const keyPair = await account.unlockKeystore(promptPassword, props.keystore);
            if(keyPair){
                setPrivateKey(keyPair.privateKey.toHexString());
                setTimeout(setShowPrompt,400,false);
                setPasswordType("text");
                setEyeSlash(true);
                return {valid: true};
            } else {
                return {
                    valid: false,
                    errorMessage: "Invalid password"
                };
            }
        } else {
            return {
                valid: false,
                errorMessage: "Error, account not found"
            };
        }
    };

    const handleEyeClick = (): void => {
        if(eyeSlash){
            setPasswordType("password");
            setEyeSlash(false);
        }else{
            setShowPrompt(true);
        }
    };

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
                focused={false}
                readOnly={true}
                inputId={props.inputId}
                type={passwordType}
                eye={true}
                eyeSlash={eyeSlash}
                onEyeClick={handleEyeClick}
            />
        </>
    );
};
