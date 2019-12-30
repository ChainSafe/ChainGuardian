import * as React from "react";
import {ReactElement, Component} from "react";
import {Background} from "../../components/Background/Background";
import {Modal} from "../../components/Modal/Modal";
import {InputForm} from "../../components/Input/InputForm";
import {ButtonPrimary, ButtonSecondary} from "../../components/Button/ButtonStandard";
import {Link} from "react-router-dom";
import {Routes, OnBoardingRoutes} from "../../constants/routes";
import {CGAccount} from "../../models/account";
import {RouteComponentProps} from "react-router";
import {Notification} from "../../components/Notification/Notification";
import {Level, Horizontal, Vertical} from "../../components/Notification/NotificationEnums";

interface IState {
    input: string;
    notification: boolean;
}

export default class LoginContainer extends Component<RouteComponentProps> {
    public state: IState = {
        input: "",
        notification: false
    };
    private handleChange = (e: React.FormEvent<HTMLInputElement>): void => {
        this.setState({input: e.currentTarget.value});
    };
    
    private handleSubmit = (): void => {
        const account = new CGAccount({
            name: "",
            directory: "",
            sendStats: false
        });
        console.log(account.isCorrectPassword(this.state.input));
        if(account.isCorrectPassword(this.state.input)){
            this.props.history.push(Routes.DASHBOARD_ROUTE);
        } else {
            this.setState({notification: true});
        }
    }

    public render(): ReactElement {
        return (
            <Background>
                <Modal>
                    <Notification
                        title="Incorrect password"
                        isVisible={this.state.notification}
                        level={Level.ERROR}
                        horizontalPosition={Horizontal.CENTER}
                        verticalPosition={Vertical.TOP}
                        onClose={(): void => {this.setState({notification: false});}}
                    >
                    Try again.
                    </Notification>
                    <h1>Welcome!</h1>
                    <p>Please enter your password or set up an account to get started.</p>
                    <div className="input-container">
                        <InputForm 
                            inputId="inputPassword"
                            focused onChange={this.handleChange} 
                            inputValue={this.state.input} 
                            placeholder="Enter password"
                        />
                        <ButtonSecondary
                            buttonId="go"
                            onClick={(): void => {this.handleSubmit()}}
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
}