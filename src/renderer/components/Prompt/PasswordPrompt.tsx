import * as React from "react";
import {InputPrompt, ISubmitStatus} from "./InputPrompt";

export interface IPasswordPromptProps {
    /**
     * Called on submit password confirmation.
     *
     * @param password - that is entered in password prompt dialog
     * @return ISubmitStatus - containing information on validation success and errorMessage if any.
     */
    onSubmit: (password: string) => ISubmitStatus;
    /**
     * Called on cancel password prompt.
     */
    onCancel: () => void;
    /**
     * Boolean controlling is prompt displaying.
     */
    display: boolean;
}

export const PasswordPrompt: React.FunctionComponent<IPasswordPromptProps> = (props: IPasswordPromptProps) => {
    return(
        <InputPrompt
            onSubmit={props.onSubmit}
            onCancel={props.onCancel}
            display={props.display}
            title={"Confirm password"}
            placeholder={"Please reenter your password..."}
            inputType={"password"}
        />
    );
};