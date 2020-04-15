import * as React from "react";
import {ReactElement, Component} from "react";
import {Background} from "../../components/Background/Background";
import {Modal} from "../../components/Modal/Modal";
import {InputForm} from "../../components/Input/InputForm";
import {ButtonPrimary, ButtonSecondary} from "../../components/Button/ButtonStandard";
import {Link} from "react-router-dom";
import {Routes, OnBoardingRoutes} from "../../constants/routes";
import {RouteComponentProps} from "react-router";
import {Level, Horizontal, Vertical} from "../../components/Notification/NotificationEnums";
import database from "../../services/db/api/database";
import {bindActionCreators, Dispatch} from "redux";
import {connect} from "react-redux";
import {storeAuthAction, storeNotificationAction} from "../../actions";
import {IRootState} from "../../reducers";
import {DEFAULT_ACCOUNT} from "../../constants/account";

interface IState {
    input: string;
}

type IOwnProps = Pick<RouteComponentProps, "history">;

interface IInjectedProps{
    storeAuth: typeof storeAuthAction;
    notification: typeof storeNotificationAction;
}

class Login extends Component<
IOwnProps & IInjectedProps & Pick<IRootState, "auth">, IState> {

    public state: IState = {
        input: ""
    };

    public render(): ReactElement {
        return (
            <Background>
                <Modal>
                    <h1>Welcome!</h1>
                    <p>Please enter your password or set up an account to get started.</p>
                    <div className="input-container">
                        <InputForm
                            inputId="inputPassword"
                            focused
                            onChange={this.handleChange}
                            inputValue={this.state.input}
                            placeholder="Enter password"
                            type="password"
                            onSubmit={(e): void => {e.preventDefault();}}
                        />
                        <ButtonSecondary
                            buttonId="go"
                            onClick={this.handleSubmit}
                        >
                            GO
                        </ButtonSecondary>
                    </div>
                    <h5 className="input-or">OR</h5>

                    <ButtonPrimary
                        buttonId="register"
                        onClick={this.handleRegisterClick}
                    >
                        REGISTER
                    </ButtonPrimary>
                </Modal>
            </Background>
        );
    }

    private handleChange = (e: React.FormEvent<HTMLInputElement>): void => {
        this.setState({input: e.currentTarget.value});
    };

    private handleSubmit = async (): Promise<void> => {
        const account = await database.account.get(DEFAULT_ACCOUNT);
        if (account !== null) {
            const isCorrectValue = await account.isCorrectPassword(this.state.input);
            if (isCorrectValue) {
                await account.unlock(this.state.input);
                this.props.storeAuth(account);
                this.props.history.push(Routes.DASHBOARD_ROUTE);
            } else {
                this.displayNotification("Incorrect password", "Try again");
            }
        } else {
            this.displayNotification("Account does not exist", "Please register");
        }
    };

    private handleRegisterClick = (): void => {
        this.props.history.push(Routes.ONBOARD_ROUTE_EVALUATE(OnBoardingRoutes.SIGNING));
    };

    private displayNotification = (title: string, content: string): void => {
        this.props.notification({
            source: this.props.history.location.pathname,
            isVisible: true,
            title,
            content,
            horizontalPosition: Horizontal.CENTER,
            verticalPosition: Vertical.TOP,
            level: Level.ERROR,
            expireTime: 3
        });
    }
}

const mapDispatchToProps = (dispatch: Dispatch): IInjectedProps =>
    bindActionCreators(
        {
            storeAuth: storeAuthAction,
            notification: storeNotificationAction,
        },
        dispatch
    );

export const LoginContainer = connect(
    null,
    mapDispatchToProps
)(Login);
