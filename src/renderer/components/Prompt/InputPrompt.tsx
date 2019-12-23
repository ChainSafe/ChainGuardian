import * as React from "react";
import {InputForm} from "../Input/InputForm";
import {ButtonDestructive, ButtonPrimary} from "../Button/ButtonStandard";
import {useState} from "react";

export interface IInputPromptProps {
    title: string;
    placeholder?: string;
    inputType?: string;
    onSubmit: (data: string) => ISubmitStatus;
    onCancel: () => void;
    display: boolean;
}

export interface ISubmitStatus {
    valid: boolean
    errorMessage?: string;
}

export const InputPrompt: React.FunctionComponent<IInputPromptProps> = (props: IInputPromptProps) => {
    const [inputData, setInputData] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string | undefined>();
    const [valid, setValid] = useState<boolean | undefined>();

    function onSubmitWrapper(): void {
        const result = props.onSubmit(inputData);
        setValid(result.valid);
        if (!result.valid)
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
                    valid={valid}
                    onChange={(i): void => { setInputData(i.currentTarget.value); }}
                    onSubmit={(e): void => {e.preventDefault();}} /** Disable submit on enter **/
                    type={props.inputType}
                />
                <div className={"button-control"}>
                    <div className={"prompt-cancel-button"}>
                        <ButtonDestructive onClick={props.onCancel}>
                            Cancel
                        </ButtonDestructive>
                    </div>
                    <div className={"prompt-confirm-button"}>
                        <ButtonPrimary onClick={(): void => onSubmitWrapper()}>
                            OK
                        </ButtonPrimary>
                    </div>
                </div>
            </div>
        </div>
    );
};