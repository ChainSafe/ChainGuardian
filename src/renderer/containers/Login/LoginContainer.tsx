import React, {ReactElement, Component} from "react";
import {RouteComponentProps} from "react-router";
import {bindActionCreators, Dispatch} from "redux";
import {connect} from "react-redux";

import {Background} from "../../components/Background/Background";
import {Modal} from "../../components/Modal/Modal";
import {InputForm} from "../../components/Input/InputForm";
import {ButtonPrimary, ButtonSecondary} from "../../components/Button/ButtonStandard";
import {Routes, OnBoardingRoutes} from "../../constants/routes";
import {Level, Horizontal, Vertical} from "../../components/Notification/NotificationEnums";
import database from "../../services/db/api/database";
import {storeAuthAction, storeNotificationAction} from "../../actions";
import {IRootState} from "../../reducers";
import {DEFAULT_ACCOUNT} from "../../constants/account";
import {ConfirmModal} from "../../components/ConfirmModal/ConfirmModal";
import {cleanUpAccount} from "../../services/utils/account";

interface IState {
    input: string;
    confirmModal: boolean;
}

type IOwnProps = Pick<RouteComponentProps, "history">;

interface IInjectedProps{
    storeAuth: typeof storeAuthAction;
    notification: typeof storeNotificationAction;
}

class Login extends Component<
IOwnProps & IInjectedProps & Pick<IRootState, "auth">, IState> {

    public state: IState = {
        input: "",
        confirmModal: false,
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

                <ConfirmModal
                    showModal={this.state.confirmModal}
                    question={"Are you sure?"}
                    description={"You already have an account registered. If you continue, all data will be erased."}
                    onOKClick={this.handleNewAccount}
                    onCancelClick={(): void => this.setState({confirmModal: false})}
                />
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

    private handleRegisterClick = async(): Promise<void> => {
        const account = await database.account.get(DEFAULT_ACCOUNT);
        if (!account) {
            this.props.history.push(Routes.ONBOARD_ROUTE_EVALUATE(OnBoardingRoutes.SIGNING));
        } else {
            this.setState({confirmModal: true});
        }
    };

    private handleNewAccount = async(): Promise<void> => {
        await cleanUpAccount();
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
    };
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
