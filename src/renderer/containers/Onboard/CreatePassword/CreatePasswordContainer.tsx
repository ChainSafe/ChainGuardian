import * as React from "react";
import {Component, ReactElement} from "react";
import {IInputFormProps} from "../../../components/Input/InputForm";
import {ButtonPrimary} from "../../../components/Button/ButtonStandard";
import {Loading} from "../../../components/Loading/Loading";
import {MultipleInputVertical} from "../../../components/MultipleInputVertical/MultipleInputVertical";
import {RouteComponentProps} from "react-router";
import {passwordFormSchema} from "./validation";
import {joiValidationToErrorMessages} from "../../../services/validation/util";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {OnBoardingRoutes, Routes} from "../../../constants/routes";
import {IRootState} from "../../../ducks/reducers";
import {afterConfirmPassword, afterCreatePassword} from "../../../ducks/register/actions";
import {getAuthAccount} from "../../../ducks/auth/selectors";
import {getKeystorePath} from "../../../ducks/register/selectors";
import {V4Keystore} from "../../../services/keystore";

export interface IState {
    password: string;
    confirm: string;
    errorMessages: {
        password?: string,
        confirm?: string
    };
    validated: boolean;
    loading: boolean;
}

interface IStateProps {
    isFirstTimeRegistration: boolean;
    path: string | undefined;
}

interface IInjectedProps {
    afterCreatePassword: typeof afterCreatePassword;
    afterConfirmPassword: typeof afterConfirmPassword;
}

// TODO?: in case of import this component should ask for changing password os skip??
export class CreatePassword extends Component<Pick<RouteComponentProps, "history"> & IInjectedProps & IStateProps> {
    public state: IState = {
        password: "",
        confirm: "",
        errorMessages: {},
        validated: !this.props.path,
        loading: false,
    };

    public render(): ReactElement {
        const inputs: Array<IInputFormProps> = [
            {
                inputId:"password",
                focused: true,
                onChange: !this.props.path ? this.handleChange : this.handleConfirmPassword,
                placeholder: "Enter password",
                valid: this.isValid(this.state.errorMessages.password),
                errorMessage: this.state.errorMessages.password,
            }
        ];
        if (!this.props.path) {
            inputs.push({
                inputId:"confirm",
                onChange: this.handleChange,
                placeholder: "Confirm password",
                valid: this.isValid(this.state.errorMessages.confirm) &&
                    this.isValid(this.state.errorMessages.password),
                errorMessage: this.state.errorMessages.confirm
            });
        }

        const {errorMessages, loading} = this.state;
        return (
            <>
                <h1>{!this.props.path ? "Create" : "Validate"} a password</h1>
                {!this.props.path && <p>You will use this password to unlock applications and keys.</p>}
                <div className="input-container input-container-vertical">
                    <form
                        onSubmit={(): void => {this.setState({loading: true}); this.handleSubmit();}}
                        className="flex-column"
                    >
                        <MultipleInputVertical inputs={inputs}/>
                        {this.state.validated ?
                            <ButtonPrimary
                                buttonId="next"
                                disabled={errorMessages.password !== "" || errorMessages.confirm !== ""}
                                type="submit"
                            >
                                NEXT
                            </ButtonPrimary>
                            :
                            <ButtonPrimary
                                onClick={this.handleValidateClick}
                                buttonId="validate"
                                disabled={!this.state.password}
                                type="button"
                            >
                                VALIDATE
                            </ButtonPrimary>
                        }
                    </form>
                </div>

                <Loading visible={loading} title={this.state.validated ? "Loading" : "Validating"} />
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

    private handleConfirmPassword = (event: React.FormEvent<HTMLInputElement>): void => {
        this.setState({password: event.currentTarget.value, validated: false});
    };

    private handleValidateClick = (): void => {
        this.setState({loading: true});
        new V4Keystore(this.props.path).verifyPassword(this.state.password)
            .then(ok => {
                const newState = {loading: false, validated: false, errorMessages: {password: "", confirm: ""}};
                if (!ok) newState.errorMessages.password = "Wrong password!";
                else newState.validated = true;
                this.setState(newState);
            });
    };

    private handleSubmit = (): void => {
        if (!this.props.path) {
            this.props.afterCreatePassword(this.state.password);
        } else {
            this.props.afterConfirmPassword(this.state.password);
        }
        this.setState({loading: false});

        if (this.props.isFirstTimeRegistration) {
            this.props.history.push(Routes.ONBOARD_ROUTE_EVALUATE(OnBoardingRoutes.CONSENT));
        } else {
            this.props.history.push(Routes.DASHBOARD_ROUTE);
        }
    };
}

const mapDispatchToProps = (dispatch: Dispatch): IInjectedProps =>
    bindActionCreators(
        {
            afterCreatePassword,
            afterConfirmPassword,
        },
        dispatch
    );

const mapStateToProps = (state: IRootState): IStateProps => ({
    isFirstTimeRegistration: !getAuthAccount(state),
    path: getKeystorePath(state),
});

export const CreatePasswordContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(CreatePassword);
