import React, {Component, ReactElement} from "react";
import {match, RouteComponentProps} from "react-router-dom";
import {Background} from "../../components/Background/Background";
import OnBoardModal from "./OnBoardModal";
import SigningKey from "./SigningKey/SigningKey";
import WithdrawalKeyImport from "./WithdrawalKey/WithdrawalKeyImport";
import {OnBoardingRoutes} from "../../constants/routes";
import {SigningKeyVerifyContainer} from "./SigningKey/Verify/SigningMnemonicQuestion";
import {SigningKeyGenerateContainer} from "./SigningKey/Generate/SigningMnemonic";
import {SigningKeyImport} from "./SigningKey/Import/SigningKeyImport";
import DepositTxContainer from "./DepositTx/DepositTxContainer";
import {CreatePasswordContainer} from "./CreatePassword/CreatePasswordContainer";

interface IOnboardStep {
    step: string
}

interface IProps extends RouteComponentProps {
    match: match<IOnboardStep>
}

export default class OnboardContainer extends Component<IProps, {}> {

    private Steper = {
        [OnBoardingRoutes.SIGNING]: <SigningKey />,
        [OnBoardingRoutes.SIGNING_IMPORT]: <SigningKeyImport history={this.props.history} />,
        [OnBoardingRoutes.WITHDRAWAL_IMPORT]: <WithdrawalKeyImport history={this.props.history} />,
        [OnBoardingRoutes.SIGNING_KEY_GENERATE]: <SigningKeyGenerateContainer history={this.props.history}/>,
        [OnBoardingRoutes.SIGNING_KEY_VALIDATE]: <SigningKeyVerifyContainer history={this.props.history}/>,
        [OnBoardingRoutes.PASSWORD]: <CreatePasswordContainer history={this.props.history}/>,
        [OnBoardingRoutes.DEPOSIT_TX]: <DepositTxContainer history={this.props.history}/>
    };

    public render(): ReactElement {
        const {step} = this.props.match.params;
        return (
            <Background>
                <OnBoardModal history={this.props.history} currentStep={parseInt(step.split("_")[0])}>
                    {this.renderStep()}
                </OnBoardModal>
            </Background>
        );
    }

    private renderStep = (): React.FunctionComponent => {
        const {step} = this.props.match.params;
        return (this.Steper as any)[step];
    };
}
