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
import database from "../../services/db/api/database";
import {bindActionCreators, Dispatch} from "redux";
import {connect} from "react-redux";
import {storeAuthAction,} from "../../actions";
import {IRootState} from "../../reducers";

interface IState {
    input: string;
    notification: boolean;
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IOwnProps extends Pick<RouteComponentProps, "history"> {
}
interface IInjectedProps{
    storeAuth: typeof storeAuthAction;
}

class Login extends Component<
IOwnProps & IInjectedProps & Pick<IRootState, "register">, IState> {

    public state: IState = {
        input: "",
        notification: false,
    };
    
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
    private handleChange = (e: React.FormEvent<HTMLInputElement>): void => {
        this.setState({input: e.currentTarget.value});
    };
    
    private handleSubmit = async (): Promise<void> => {

        const account = await database.account.get("account");
        console.log(account);
        if(account!==null){
            if(account.isCorrectPassword(this.state.input)){
                this.props.storeAuth(this.state.input);
                this.props.history.push(Routes.DASHBOARD_ROUTE);
            } else {
                console.log("wrong password");
                this.setState({notification: true});
            }
        }else {
            console.log("account===null");
            this.setState({notification: true});
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