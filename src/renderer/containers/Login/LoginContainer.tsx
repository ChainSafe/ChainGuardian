import * as React from "react";
import {Background} from "../../components/Background/Background";
import {Modal} from "../../components/Modal/Modal";
import {InputForm} from "../../components/Input/InputForm";
import {ButtonPrimary, ButtonSecondary} from "../../components/Button/ButtonStandard";
import {Link} from "react-router-dom";
import {Routes, OnBoardingRoutes} from "../../constants/routes";

interface IState {
    input: string;
}

export default class LoginContainer extends React.Component {
    public state: IState = {
        input: ""
    };
    public handleChange = (e: React.FormEvent<HTMLInputElement>): void => {
        this.setState({input: e.currentTarget.value});
    };
    
    public render(): any {
        return (
            <Background>
                <Modal>
                    <h1>Welcome!</h1>
                    <p>Please enter your password or set up an account to get started.</p>
                    <div className="input-container">
                        <InputForm 
                            inputId="inputPassword"
                            focused onChange={this.handleChange} 
                            inputValue={this.state.input} 
                            placeholder="Enter password"
                        /> 
                        <ButtonSecondary buttonId="go" >GO</ButtonSecondary>
                    </div>
                    <h5>OR</h5>
                    <Link to={Routes.ONBOARD_ROUTE_EVALUATE(OnBoardingRoutes.SIGNING)}>
                        <ButtonPrimary buttonId="register">REGISTER</ButtonPrimary>
                    </Link>
                </Modal>
            </Background>
        );
    }
}