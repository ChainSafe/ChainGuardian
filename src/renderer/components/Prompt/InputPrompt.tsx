import * as React from "react";
import {InputForm} from "../Input/InputForm";
import {ButtonDestructive, ButtonPrimary} from "../Button/ButtonStandard";
import {useState} from "react";

export interface IInputPromptProps {
    title: string;
    placeholder?: string;
    inputType?: string;
    onSubmit: (data: string) => ISubmitStatus;
    display: boolean;
}

export interface ISubmitStatus {
    errorMessage: string;
}

export const InputPrompt: React.FunctionComponent<IInputPromptProps> = (props: IInputPromptProps) => {
    const [inputData, setInputData] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string | undefined>();

    function onSubmitWrapper(): void {
        const result = props.onSubmit(inputData);
        setErrorMessage(result.errorMessage);
    }

    return(
        <div className={`prompt-overlay ${props.display ? "prompt-show" : "prompt-hide"}`}>
            <div className={"prompt-modal"}>
                <h2 className={"prompt-title"}>{props.title}</h2>
                <InputForm
                    inputId={"prompt-input"}
                    placeholder={props.placeholder}
                    errorMessage={errorMessage}
                    valid={errorMessage ? errorMessage.length === 0 : undefined}
                    onChange={(i): void => { setInputData(i.currentTarget.value); }}
                    type={props.inputType}
                />
                <div className={"button-control"}>
                    <div className={"prompt-cancel-button"}>
                        <ButtonDestructive>Cancel</ButtonDestructive>
                    </div>
                    <div className={"prompt-confirm-button"}>
                        <ButtonPrimary onClick={(): void => onSubmitWrapper()}>OK</ButtonPrimary>
                    </div>
                </div>
            </div>
        </div>
    );
};