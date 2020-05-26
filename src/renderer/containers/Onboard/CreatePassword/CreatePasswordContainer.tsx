import * as React from "react";
import {Component, ReactElement} from "react";
import {IInputFormProps} from "../../../components/Input/InputForm";
import {ButtonPrimary} from "../../../components/Button/ButtonStandard";
import {MultipleInputVertical} from "../../../components/MultipleInputVertical/MultipleInputVertical";
import {RouteComponentProps} from "react-router";
import {passwordFormSchema} from "./validation";
import {joiValidationToErrorMessages} from "../../../services/validation/util";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {afterPasswordAction} from "../../../actions";
import {Routes} from "../../../constants/routes";

export interface IState {
    password: string;
    confirm: string;
    errorMessages: {
        password?: string,
        confirm?: string
    };
}


interface IInjectedProps {
    afterPassword: typeof afterPasswordAction;
}

export class CreatePassword extends Component<Pick<RouteComponentProps, "history"> & IInjectedProps> {

    public state: IState = {
        password: "",
        confirm: "",
        errorMessages: {}
    };

    public render(): ReactElement {
        const inputs: Array<IInputFormProps> = [
            {
                inputId:"password",
                focused: true,
                onChange: this.handleChange,
                placeholder: "Enter password",
                valid: this.isValid(this.state.errorMessages.password),
                errorMessage: this.state.errorMessages.password
            },
            {
                inputId:"confirm",
                onChange: this.handleChange,
                placeholder: "Confirm password",
                valid: this.isValid(this.state.errorMessages.confirm) &&
                    this.isValid(this.state.errorMessages.password),
                errorMessage: this.state.errorMessages.confirm
            }
        ];

        const {errorMessages} = this.state;

        return (
            <>
                <h1>Create a password</h1>
                <p>You will use this password to unlock applications and keys.</p>
                <div className="input-container input-container-vertical">
                    <form onSubmit={this.handleSubmit} className="flex-column">
                        <MultipleInputVertical inputs={inputs}/>
                        <ButtonPrimary
                            buttonId="next"
                            disabled={errorMessages.password !== "" || errorMessages.confirm !== ""}
                            type="submit"
                        >
                            NEXT
                        </ButtonPrimary>
                    </form>
                </div>
            </>
        );
    }

    private isValid(error: string | undefined): boolean | undefined {
        return (typeof error === "undefined") ? error : (error === "");
    }

    private handleChange = (e: React.FormEvent<HTMLInputElement>): void => {
        const localState = this.state as any;
        localState[e.currentTarget.id] = e.currentTarget.value;
        this.setState({[e.currentTarget.id]: e.currentTarget.value});
        const validation = passwordFormSchema.validate(localState);
        const m = {password: "", confirm: ""};
        if (validation.error) {
            const errors = joiValidationToErrorMessages(validation.error);
            if (errors.password) m.password = errors.password.join(".");
            if (errors.confirm) m.confirm = errors.confirm.join(".");
        }
        this.setState({errorMessages: m});
    };

    private handleSubmit= (): void => {
        const {password} = this.state;
        this.props.afterPassword(password);
        this.props.history.push(Routes.DASHBOARD_ROUTE);
    };
}

const mapDispatchToProps = (dispatch: Dispatch): IInjectedProps =>
    bindActionCreators(
        {
            afterPassword: afterPasswordAction,
        },
        dispatch
    );

export const CreatePasswordContainer = connect(
    null,
    mapDispatchToProps
)(CreatePassword);
