import * as React from "react";
import {InputForm} from "../Input/InputForm";
import {ButtonDestructive, ButtonPrimary} from "../Button/ButtonStandard";

export interface IInputPromptProps {
    title?: string;
    placeholder?: string;
    onSubmit: (e: React.FormEvent<HTMLInputElement>) => void;
    onChange?: (e: React.FormEvent<HTMLInputElement>) => void;
    display: boolean;
}

export const InputPrompt: React.FunctionComponent<IInputPromptProps> = (props: IInputPromptProps) => {
    return(
        <div className={`prompt-overlay ${props.display ? "prompt-show" : "prompt-hide"}`}>
            <div className={"prompt-modal"}>
                <h2 className={"prompt-title"}>{props.title}</h2>
                <InputForm
                    inputId={"prompt-input"}
                    placeholder={props.placeholder}
                    onChange={props.onChange}
                />
                <div className={"button-control"}>
                    <div className={"prompt-cancel-button"}>
                        <ButtonDestructive>Cancel</ButtonDestructive>
                    </div>
                    <div className={"prompt-confirm-button"}>
                        <ButtonPrimary>OK</ButtonPrimary>
                    </div>
                </div>

            </div>
        </div>
    );
};