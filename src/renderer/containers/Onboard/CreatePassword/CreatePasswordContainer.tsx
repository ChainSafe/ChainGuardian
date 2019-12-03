import * as React from "react";
import {Component, ReactElement} from "react";
import {IInputFormProps} from "../../../components/Input/InputForm";
import {ButtonPrimary} from "../../../components/Button/ButtonStandard";
import {MultipleInputVertical} from "../../../components/MultipleInputVertical/MultipleInputVertical";
import {RouteComponentProps} from "react-router";
import {passwordFormSchema} from "./validation";
import {joinArrayOxfStyle, joiValidationToErrorDetailsMessages} from "../../../services/validation/util";

export interface IState {
    password: string;
    confirm: string;
    errorMessages: {
        password?: string,
        confirm?: string
    };
}

export class CreatePasswordContainer extends Component<Pick<RouteComponentProps, "history">> {

    public state: IState = {
        password: "",
        confirm: "",
        errorMessages: {}
    };

    public render(): ReactElement {
        const inputs: Array<IInputFormProps> = [
            {
                inputId:"inputPassword",
                onChange: this.handleChange,
                placeholder: "Enter password",
                valid: this.isValid(this.state.errorMessages.password),
                errorMessage: this.state.errorMessages.password
            },
            {
                inputId:"confirmPassword",
                onChange: this.handleChange,
                placeholder: "Confirm password",
                valid: this.isValid(this.state.errorMessages.confirm),
                errorMessage: this.state.errorMessages.confirm
            }
        ];
        return (
            <>
                <h1>Create a password</h1>
                <p>You will use this password to unlock applications and keys.</p>
                <div className="input-container input-container-vertical">
                    <MultipleInputVertical inputs={inputs}/>
                    <ButtonPrimary
                        buttonId="next"
                        disabled={ this.state.errorMessages.password !== "" || this.state.errorMessages.confirm !== ""}
                    >
                        NEXT
                    </ButtonPrimary>
                </div>
            </>
        );
    }

    private isValid(error: string | undefined): boolean | undefined {
        return (typeof error === "undefined") ? error : (error === "");
    }

    private handleChange = (e: React.FormEvent<HTMLInputElement>): void => {
        const selector = (e.currentTarget.id === "inputPassword") ? "password" : "confirm";
        const localState = this.state;
        localState[selector] = e.currentTarget.value;
        this.setState({[selector]: e.currentTarget.value});
        // validate state
        const validation = passwordFormSchema.validate(localState, {abortEarly: false});
        // generate error messages
        const m: {password?: string, confirm?: string} = {password: "", confirm: ""};
        if (validation.error) {
            const errors = joiValidationToErrorDetailsMessages(validation.error);
            // confirmation errors
            if (localState.confirm === "") {
                m.confirm = undefined;  // empty input
            } else if (errors.confirm) {
                m.confirm = errors.confirm.any.join();
            }
            // password errors
            if (localState.password === "") {
                m.password = undefined; // empty input
            } else if (errors.password) {
                // base length errors
                if (errors.password.string) {
                    m.password = errors.password.string.join();
                }
                // complexity errors, if no base errors
                if (errors.password.complexity && m.password === "") {
                    const complexityErrors =
                        joinArrayOxfStyle(errors.password.complexity, ",", "and");
                    m.password = `Password must contain: ${complexityErrors} character`;
                }
            }
        }
        this.setState({errorMessages: m});
    };
}