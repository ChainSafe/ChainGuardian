import React from "react";
import {useState} from "react";
import {ICGKeystore} from "../../services/keystore";
import { BlsKeypair } from "../../types";
import {InputForm, IInputFormProps} from "../Input/InputForm";
import {PasswordPrompt} from "../Prompt/PasswordPrompt";

interface IPrivateKeyFieldProps extends IInputFormProps {
    keystore: ICGKeystore;
}

export const PrivateKeyField: React.FunctionComponent<IPrivateKeyFieldProps> = (props: IPrivateKeyFieldProps) => {
    const [showPrompt, setShowPrompt] = useState<boolean>(false);
    const [passwordType, setPasswordType] = useState<string>("password");
    const [eyeSlash, setEyeSlash] = useState<boolean>(false);
    const [privateKey, setPrivateKey] = useState<string>("encrypted");

    const handlePromptSubmit = async (keypair: BlsKeypair): Promise<void> => {
        setPrivateKey(keypair.privateKey.toHex());
        setTimeout(setShowPrompt, 200, false);
        setPasswordType("text");
        setEyeSlash(true);
    };

    const handleEyeClick = (): void => {
        if (eyeSlash) {
            setPasswordType("password");
            setEyeSlash(false);
        } else {
            setShowPrompt(true);
        }
    };

    return (
        <>
            <PasswordPrompt
                keystore={props.keystore}
                display={showPrompt}
                onSubmit={handlePromptSubmit}
                onCancel={(): void => {
                    setShowPrompt(false);
                }}
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
