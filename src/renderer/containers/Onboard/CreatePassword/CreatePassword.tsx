import * as React from "react";
import {Component, ReactElement} from "react";
import {IInputFormProps} from "../../../components/Input/InputForm";
import {ButtonPrimary} from "../../../components/Button/ButtonStandard";
import {History} from "history";
import {MultipleInputVertical} from "../../../components/MultipleInputVertical/MultipleInputVertical";

interface IState {
    input: string;
    confirmInput: string;
}

export default class CreatePassword extends Component<{ history: History }, {}> {
    public state: IState = {
        input: "",
        confirmInput: ""
    };

    public handleChange = (e: React.FormEvent<HTMLInputElement>): void => {
        this.setState({input: e.currentTarget.value});
    };

    public compareInput = (e: React.FormEvent<HTMLInputElement>): void => {
        this.setState({confirmInput: e.currentTarget.value});
        if (this.state.input === e.currentTarget.value) {
            //
        } else {
            //
        }
    };

    public render(): ReactElement {
        const inputs: Array<IInputFormProps> = [
            {
                inputId:"inputPassword",
                onChange: this.handleChange,
                placeholder: "Enter password",
            },
            {
                inputId:"confirmPassword",
                onChange: this.compareInput,
                placeholder: "Confirm password"
            }
        ];
        return (
            <>
                <h1>Create a password</h1>
                <p>You will use this password to unlock applications and keys.</p>
                <div className="input-container input-container-vertical">
                    <MultipleInputVertical inputs={inputs}/>
                    <ButtonPrimary buttonId="next">NEXT</ButtonPrimary>
                </div>
            </>
        );
    }
}