import * as React from "react";
import {InputForm} from "../Input/InputForm";
import {ButtonDestructive, ButtonPrimary} from "../Button/ButtonStandard";
import {useState} from "react";

export interface IInputPromptProps {
    title: string;
    placeholder?: string;
    inputType?: string;
    onSubmit: (data: string) => Promise<ISubmitStatus>;
    onChange?: (e: React.FormEvent<HTMLInputElement>) => void;
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

    async function onSubmitWrapper(): Promise<void> {
        const result = await props.onSubmit(inputData);
        setValid(result.valid);
        if (!result.valid) {
            setErrorMessage(result.errorMessage);
        }
        else {
            setTimeout(setInputData,500,""); /** Prompt reset */ 
            setTimeout(setValid,500,undefined);
        }
    }
    function onCancelWrapper(): void {
        setInputData("");
        props.onCancel();
    }

    function handleOnChange(e: React.FormEvent<HTMLInputElement>): void {
        setInputData(e.currentTarget.value);
        if (props.onChange) props.onChange(e);
    }

    return(
        <div className={`prompt-overlay ${props.display ? "prompt-show" : "prompt-hide"}`}>
            <div className={"prompt-modal"}>
                <h2 className={"prompt-title"}>{props.title}</h2>
                <InputForm
                    inputValue={inputData}
                    inputId={"prompt-input"}
                    placeholder={props.placeholder}
                    errorMessage={errorMessage}
                    valid={valid}
                    onChange={handleOnChange}
                    onSubmit={(e): void => {e.preventDefault();}} /** Disable submit on enter **/
                    type={props.inputType}
                />
                <div className={"button-control"}>
                    <div className={"prompt-cancel-button"}>
                        <ButtonDestructive onClick={onCancelWrapper}>
                            Cancel
                        </ButtonDestructive>
                    </div>
                    <div className={"prompt-confirm-button"}>
                        <ButtonPrimary onClick={onSubmitWrapper}>
                            OK
                        </ButtonPrimary>
                    </div>
                </div>
            </div>
        </div>
    );
};