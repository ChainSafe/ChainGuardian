import * as React from "react";
import {ReactElement, Component} from "react";
import {Background} from "../../components/Background/Background";
import {Modal} from "../../components/Modal/Modal";
import {InputForm} from "../../components/Input/InputForm";
import {ButtonPrimary, ButtonSecondary} from "../../components/Button/ButtonStandard";
import {Link} from "react-router-dom";
import {Routes, OnBoardingRoutes} from "../../constants/routes";
import {RouteComponentProps} from "react-router";
import {Notification} from "../../components/Notification/Notification";
import {Level, Horizontal, Vertical} from "../../components/Notification/NotificationEnums";
import {INotification} from "../../services/utils/notification-utils";
import database from "../../services/db/api/database";
import {bindActionCreators, Dispatch} from "redux";
import {connect} from "react-redux";
import {storeAuthAction} from "../../actions/auth";
import {IRootState} from "../../reducers";
import {DEFAULT_ACCOUNT} from "../../constants/account";

interface IState {
    input: string;
    notification: INotification | null;
}

type IOwnProps = Pick<RouteComponentProps, "history">;

interface IInjectedProps{
    storeAuth: typeof storeAuthAction;
}

class Login extends Component<
IOwnProps & IInjectedProps & Pick<IRootState, "auth">, IState> {

    public state: IState = {
        input: "",
        notification: null,
    };
    
    public render(): ReactElement {
        return (
            <Background>
                <Modal>
                    <Notification
                        title={this.state.notification ? this.state.notification.title : ""}
                        isVisible={this.isNotificationVisible()}
                        level={Level.ERROR}
                        horizontalPosition={Horizontal.CENTER}
                        verticalPosition={Vertical.TOP}
                        onClose={(): void => {this.setState({notification: null});}}
                    >
                        {this.state.notification ? this.state.notification.message : ""}
                    </Notification>
                    <h1>Welcome!</h1>
                    <p>Please enter your password or set up an account to get started.</p>
                    <div className="input-container">
                        <InputForm 
                            inputId="inputPassword"
                            focused onChange={this.handleChange} 
                            inputValue={this.state.input} 
                            placeholder="Enter password"
                            onSubmit={(e): void => {e.preventDefault();}}
                        />
                        <ButtonSecondary
                            buttonId="go"
                            onClick={(): void => {this.handleSubmit();}}
                        >GO</ButtonSecondary>
                    </div>
                    <h5 className="input-or">OR</h5>
                    <Link to={Routes.ONBOARD_ROUTE_EVALUATE(OnBoardingRoutes.SIGNING)}>
                        <ButtonPrimary buttonId="register">REGISTER</ButtonPrimary>
                    </Link>
                </Modal>
            </Background>
        );
    }
    private isNotificationVisible = (): boolean => {
        return this.state.notification!==null ? true : false ;
    };

    private handleChange = (e: React.FormEvent<HTMLInputElement>): void => {
        this.setState({input: e.currentTarget.value});
    };
    
    private handleSubmit = async (): Promise<void> => {
        const account = await database.account.get(DEFAULT_ACCOUNT);
        if(account!==null) {
            const isCorrectValue = await account.isCorrectPassword(this.state.input);
            if(isCorrectValue){
                await account.unlock(this.state.input);
                this.props.storeAuth(account);
                this.setState({notification: null});
                this.props.history.push(Routes.DASHBOARD_ROUTE);
            } else {
                this.setState({notification: {
                    title: "Incorrect password",
                    message: "Try again"
                }});
            }
        } else {
            this.setState({notification: {
                title: "Account does not exist",
                message: "Please register"
            }});
        }
    };
}

const mapDispatchToProps = (dispatch: Dispatch): IInjectedProps =>
    bindActionCreators(
        {
            storeAuth: storeAuthAction,
        },
        dispatch
    );

export const LoginContainer = connect(
    null,
    mapDispatchToProps
)(Login);