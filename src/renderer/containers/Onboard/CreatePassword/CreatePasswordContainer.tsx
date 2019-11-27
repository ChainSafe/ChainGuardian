import * as React from "react";
import {Component, ReactElement} from "react";
import {IInputFormProps} from "../../../components/Input/InputForm";
import {ButtonPrimary} from "../../../components/Button/ButtonStandard";
import {MultipleInputVertical} from "../../../components/MultipleInputVertical/MultipleInputVertical";
import {partition} from "../../../services/utils/utils";
import {RouteComponentProps} from "react-router";
import {passwordFormSchema} from "./validation";

interface IState {
    password: string;
    confirm: string;
}

export class CreatePasswordContainer extends Component<Pick<RouteComponentProps, "history">> {

    public state: IState = {
        password: "",
        confirm: "",
    };

    private validationInfo = new ValidationInfo();

    public render(): ReactElement {
        const inputs: Array<IInputFormProps> = [
            {
                inputId:"inputPassword",
                onChange: this.handleChange,
                placeholder: "Enter password",
                valid: this.validationInfo.passwordValid,
                errorMessage: this.validationInfo.validationMessage
            },
            {
                inputId:"confirmPassword",
                onChange: this.handleChange,
                placeholder: "Confirm password",
                valid: this.validationInfo.confirmationValid,
                errorMessage: this.validationInfo.confirmationMessage
            }
        ];
        return (
            <>
                <h1>Create a password</h1>
                <p>You will use this password to unlock applications and keys.</p>
                <div className="input-container input-container-vertical">
                    <MultipleInputVertical inputs={inputs}/>
                    <ButtonPrimary buttonId="next" disabled={!this.validationInfo.valid()}>
                        NEXT
                    </ButtonPrimary>
                </div>
            </>
        );
    }

    private handleChange = (e: React.FormEvent<HTMLInputElement>): void => {
        const selector = (e.currentTarget.id === "inputPassword") ? "password" : "confirm";
        // create local state used for validation
        const localState = this.state;
        localState[selector] = e.currentTarget.value;
        this.validationInfo.validate(localState);
        // change state and start render process
        this.setState({[selector]: e.currentTarget.value});
    };
}

class ValidationInfo {
    public passwordValid?: boolean;
    public confirmationValid?: boolean;
    public validationMessage?: string;
    public readonly confirmationMessage: string = "That password doesn't match. Try again?";
    public readonly separator: string = "and";

    public valid = (): boolean => {
        if (typeof this.passwordValid === "undefined" || typeof this.confirmationValid === "undefined") return false;
        return this.passwordValid && this.confirmationValid;
    };

    public validate = (state: IState): void => {
        const validation = passwordFormSchema.validate(state,{abortEarly: false});
        const isValid = (!validation.error);
        if (!isValid) { // validation failed
            const [passErrors, confErrors] =
                partition(validation.error.details,v => v.context ? v.context.key === "password" : true);
            // check validations
            this.passwordValid = passErrors.length === 0;
            this.confirmationValid = confErrors.length === 0 && this.passwordValid;
            // invalid password message
            if (!this.passwordValid) {
                // check if password empty
                const passEmpty = passErrors.find(e => e.type === "string.empty");
                if (!passEmpty) {
                    // generate descriptive message for password complexity errors
                    const passLengthError = passErrors.find(e => e.type.includes("length"));
                    const complexityErrors = passErrors.filter(e => !e.type.startsWith("string"));
                    this.validationMessage =
                        "Password must " +
                        `${passLengthError ? `${passLengthError.message} ${this.separator} ` : ""}`+
                        `contain at least ${complexityErrors.map(v => v.message).join(` ${this.separator} `)}`;
                }
            }
        } else { // validation success
            this.passwordValid = this.confirmationValid = true;
        }
    };
}