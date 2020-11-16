import * as React from "react";
import {Component, ReactElement} from "react";
import {IInputFormProps} from "../../../components/Input/InputForm";
import {ButtonPrimary, ButtonSecondary} from "../../../components/Button/ButtonStandard";
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

export interface IState {
    password: string;
    confirm: string;
    errorMessages: {
        password?: string;
        confirm?: string;
    };
    loading: boolean;
}

interface IStateProps {
    isFirstTimeRegistration: boolean;
    fromMnemonic: boolean;
}

interface IInjectedProps {
    afterCreatePassword: typeof afterCreatePassword;
    afterConfirmPassword: typeof afterConfirmPassword;
}

export class CreatePassword extends Component<Pick<RouteComponentProps, "history"> & IInjectedProps & IStateProps> {
    public state: IState = {
        password: "",
        confirm: "",
        errorMessages: {},
        loading: false,
    };

    public render(): ReactElement {
        const inputs: Array<IInputFormProps> = [
            {
                inputId: "password",
                focused: true,
                onChange: this.handleChange,
                placeholder: "Enter password",
                valid: this.isValid(this.state.errorMessages.password),
                errorMessage: this.state.errorMessages.password,
            },
            {
                inputId: "confirm",
                onChange: this.handleChange,
                placeholder: "Confirm password",
                valid:
                    this.isValid(this.state.errorMessages.confirm) && this.isValid(this.state.errorMessages.password),
                errorMessage: this.state.errorMessages.confirm,
            },
        ];

        const {errorMessages, loading} = this.state;
        return (
            <>
                <h1>{this.props.fromMnemonic ? "Create" : "Change"} a password</h1>
                <p>You will use this password to unlock validator account.</p>
                <div className='input-container input-container-vertical'>
                    <form
                        onSubmit={(): void => {
                            this.setState({loading: true});
                            this.handleSubmit();
                        }}
                        className='flex-column'>
                        <MultipleInputVertical inputs={inputs} />
                        {this.props.fromMnemonic ? (
                            <ButtonPrimary
                                buttonId='next'
                                disabled={errorMessages.password !== "" || errorMessages.confirm !== ""}
                                type='submit'>
                                NEXT
                            </ButtonPrimary>
                        ) : (
                            <div className='action-buttons'>
                                <ButtonSecondary buttonId='file' large onClick={this.handleSkip}>
                                    SKIP
                                </ButtonSecondary>
                                <ButtonPrimary
                                    buttonId='next'
                                    disabled={errorMessages.password !== "" || errorMessages.confirm !== ""}
                                    type='submit'
                                    large>
                                    NEXT
                                </ButtonPrimary>
                            </div>
                        )}
                    </form>
                </div>

                <Loading visible={loading} title={"Loading"} />
            </>
        );
    }

    private isValid(error: string | undefined): boolean | undefined {
        return typeof error === "undefined" ? error : error === "";
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

    private handleSkip = (): void => {
        this.props.afterConfirmPassword();
        this.finalizeSubmitOrSkip();
    };

    private handleSubmit = (): void => {
        if (this.props.fromMnemonic) {
            this.props.afterCreatePassword(this.state.password);
        } else {
            this.props.afterConfirmPassword(this.state.password);
        }
        this.finalizeSubmitOrSkip();
    };

    private finalizeSubmitOrSkip = (): void => {
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
        dispatch,
    );

const mapStateToProps = (state: IRootState): IStateProps => ({
    isFirstTimeRegistration: !getAuthAccount(state),
    fromMnemonic: !getKeystorePath(state),
});

export const CreatePasswordContainer = connect(mapStateToProps, mapDispatchToProps)(CreatePassword);
