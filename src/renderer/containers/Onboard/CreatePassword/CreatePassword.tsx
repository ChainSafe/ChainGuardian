import * as React from "react";
import {Component, ReactElement} from "react";
import {IInputFormProps} from "../../../components/Input/InputForm";
import {ButtonPrimary} from "../../../components/Button/ButtonStandard";
import {History} from "history";
import {MultipleInputVertical} from "../../../components/MultipleInputVertical/MultipleInputVertical";
import passwordComplexity from "../../../services/validation/password-complexity";
import {partition} from "../../../services/utils/utils";

interface IState {
    input: string;
    confirmInput: string;
    valid?: boolean;
    validationMessage: string;
    confirmed?: boolean;
}

const separator = " and ";

export default class CreatePassword extends Component<{ history: History }, {}> {
    public state: IState = {
        input: "",
        confirmInput: "",
        valid: undefined,
        validationMessage: "",
        confirmed: undefined
    };

    public handleChange = (e: React.FormEvent<HTMLInputElement>): void => {
        // convert empty string to arbitrary string for validation purposes
        const input = e.currentTarget.value === "" ? "a" : e.currentTarget.value;
        this.setState({input: input});
        // validate input
        const validation = passwordComplexity().required().validate(input);
        const isValid = (!validation.error);
        this.setState({valid: isValid});
        // extract and set validation message
        if (!isValid) {
            const [baseError, complexityErrors] =
                partition(validation.error.details,arg => arg.type.includes("length"));
            this.setState({validationMessage:
                    "Password must " +
                    `${baseError.length > 0 ? `${baseError[0].message} ${separator} ` : ""}`+
                    `contain at least ${complexityErrors.map(v => v.message).join(` ${separator} `)}`
            });
        }
        if (this.state.confirmed !== undefined) {
            this.setState({confirmed: (this.state.confirmInput === input)});
        }
    };

    public compareInput = (e: React.FormEvent<HTMLInputElement>): void => {
        this.setState({confirmInput: e.currentTarget.value});
        this.setState({confirmed: (this.state.input === e.currentTarget.value)});
    };

    public render(): ReactElement {
        const inputs: Array<IInputFormProps> = [
            {
                inputId:"inputPassword",
                onChange: this.handleChange,
                placeholder: "Enter password",
                valid: this.state.valid,
                errorMessage: this.state.validationMessage
            },
            {
                inputId:"confirmPassword",
                onChange: this.compareInput,
                placeholder: "Confirm password",
                valid: this.state.confirmed,
                errorMessage: "That password doesn't match. Try again?"
            }
        ];
        return (
            <>
                <h1>Create a password</h1>
                <p>You will use this password to unlock applications and keys.</p>
                <div className="input-container input-container-vertical">
                    <MultipleInputVertical inputs={inputs}/>
                    <ButtonPrimary buttonId="next" disabled={(!this.state.valid || !this.state.confirmed)}>
                        NEXT
                    </ButtonPrimary>
                </div>
            </>
        );
    }
}