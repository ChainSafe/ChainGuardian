import * as React from "react";
import {InputPrompt, ISubmitStatus} from "./InputPrompt";

export interface IPasswordPromptProps {
    onSubmit: (data: string) => ISubmitStatus;
    display: boolean;
}

export const PasswordPrompt: React.FunctionComponent<IPasswordPromptProps> = (props: IPasswordPromptProps) => {
    return(
        <InputPrompt
            onSubmit={props.onSubmit}
            display={props.display}
            title={"Enter password"}
            placeholder={"Please reenter your password..."}
            inputType={"password"}
        />
    );
};