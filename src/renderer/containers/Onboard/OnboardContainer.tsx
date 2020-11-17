import React, {Component, ReactElement} from "react";
import {match, RouteComponentProps} from "react-router-dom";
import {Background} from "../../components/Background/Background";
import {ConsentContainer} from "./Consent/ConsentContainer";
import OnBoardModal from "./OnBoardModal";
import {OnBoardingRoutes} from "../../constants/routes";
import {SigningKeyImportContainer} from "./SigningKey/Import/SigningKeyImport";
import {CreatePasswordContainer} from "./CreatePassword/CreatePasswordContainer";
import {ChoseImport} from "./SigningKey/ChoseImport";
import {FileUploadImport} from "./SigningKey/Import/FileUploadImport";
import {SlashingUploadImport} from "./SigningKey/Import/SlashingUploadImport";
import {FinalizeContainer} from "./Finalize/FinalizeContainer";

interface IOnboardStep {
    step: string;
}

interface IProps extends RouteComponentProps {
    match: match<IOnboardStep>;
}

export default class OnboardContainer extends Component<IProps, {}> {
    private Steper = {
        [OnBoardingRoutes.SIGNING]: <ChoseImport />,
        [OnBoardingRoutes.SIGNING_IMPORT_FILE]: <FileUploadImport history={this.props.history} />,
        [OnBoardingRoutes.SIGNING_IMPORT_SLASHING_FILE]: <SlashingUploadImport history={this.props.history} />,
        [OnBoardingRoutes.SIGNING_IMPORT_MNEMONIC]: <SigningKeyImportContainer history={this.props.history} />,
        [OnBoardingRoutes.PASSWORD]: <CreatePasswordContainer history={this.props.history} />,
        [OnBoardingRoutes.FINALIZE]: <FinalizeContainer />,
        [OnBoardingRoutes.CONSENT]: <ConsentContainer history={this.props.history} />,
    };

    private steps = [
        {stepId: 1, stepName: "Signing key"},
        {stepId: 2, stepName: "Password"},
        {stepId: 3, stepName: "Finalize"},
        {stepId: 4, stepName: "Consent"},
    ];

    public render(): ReactElement {
        const {step} = this.props.match.params;
        return (
            <Background>
                <OnBoardModal
                    history={this.props.history}
                    currentStep={parseInt(step.split("_")[0])}
                    steps={this.steps}>
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
