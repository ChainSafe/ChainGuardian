import React, {Component, ReactElement} from "react";
import {match, RouteComponentProps} from "react-router-dom";
import {Background} from "../../components/Background/Background";
import {ConfigureDockerPath} from "./Configure/ConfigureDockerPath";
import {ConsentContainer} from "./Consent/ConsentContainer";
import OnBoardModal from "./OnBoardModal";
import SigningKey from "./SigningKey/SigningKey";
import {OnBoardingRoutes} from "../../constants/routes";
import {SigningKeyVerifyContainer} from "./SigningKey/Verify/SigningKeyVerify";
import {SigningKeyGenerateContainer} from "./SigningKey/Generate/SigningKeyGenerate";
import {SigningKeyImportContainer} from "./SigningKey/Import/SigningKeyImport";
import {DepositTxContainer} from "./DepositTx/DepositTxContainer";
import {CreatePasswordContainer} from "./CreatePassword/CreatePasswordContainer";
import {ConfigureContainer} from "./Configure/ConfigureContainer";
import {ConfigureBeaconNodeContainer} from "./Configure/ConfigureBeaconNode";
import {ChoseImport} from "./SigningKey/Import/ChoseImport";
import {FileUploadImport} from "./SigningKey/Import/FileUploadImport";

interface IOnboardStep {
    step: string
}

interface IProps extends RouteComponentProps {
    match: match<IOnboardStep>
}

export default class OnboardContainer extends Component<IProps, {}> {

    private Steper = {
        [OnBoardingRoutes.SIGNING]: <SigningKey />,
        [OnBoardingRoutes.SIGNING_KEY_GENERATE]: <SigningKeyGenerateContainer history={this.props.history} />,
        [OnBoardingRoutes.SIGNING_KEY_VALIDATE]: <SigningKeyVerifyContainer history={this.props.history} />,
        [OnBoardingRoutes.SIGNING_IMPORT]: <ChoseImport />,
        [OnBoardingRoutes.SIGNING_IMPORT_FILE]: <FileUploadImport history={this.props.history} />,
        [OnBoardingRoutes.SIGNING_IMPORT_MNEMONIC]: <SigningKeyImportContainer history={this.props.history} />,
        [OnBoardingRoutes.CONFIGURE]: <ConfigureContainer history={this.props.history}/>,
        [OnBoardingRoutes.CONFIGURE_BEACON_NODE]: <ConfigureBeaconNodeContainer history={this.props.history}/>,
        [OnBoardingRoutes.CONFIGURE_DOCKER_PATH]: <ConfigureDockerPath history={this.props.history}/>,
        [OnBoardingRoutes.DEPOSIT_TX]: <DepositTxContainer history={this.props.history}/>,
        [OnBoardingRoutes.PASSWORD]: <CreatePasswordContainer history={this.props.history}/>,
        [OnBoardingRoutes.CONSENT]: <ConsentContainer history={this.props.history}/>,
    };

    private steps = [
        {stepId: 1, stepName: "Signing key"},
        {stepId: 2, stepName: "Configure"},
        {stepId: 3, stepName: "Deposit"},
        {stepId: 4, stepName: "Password"},
        {stepId: 5, stepName: "Consent"}
    ];

    public render(): ReactElement {
        const {step} = this.props.match.params;
        return (
            <Background>
                <OnBoardModal
                    history={this.props.history}
                    currentStep={parseInt(step.split("_")[0])}
                    steps={this.steps}
                >
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
