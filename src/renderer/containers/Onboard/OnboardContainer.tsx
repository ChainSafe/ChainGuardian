import React from "react";
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
import {ConfigureValidatorContainer} from "./ConfigureValidator/ConfigureValidatorContainer";
import {useSelector} from "react-redux";
import {getAuthAccount} from "../../ducks/auth/selectors";

interface IOnboardStep {
    step: string;
}

interface IProps extends RouteComponentProps {
    match: match<IOnboardStep>;
}

export const OnboardContainer: React.FC<IProps> = ({history, match}) => {
    const isFirstTimeRegistration = !useSelector(getAuthAccount);

    const steps = [
        {stepId: 1, stepName: "Signing key"},
        {stepId: 2, stepName: "Configure"},
        {stepId: 3, stepName: "Password"},
    ];
    if (isFirstTimeRegistration) {
        steps.push({stepId: 4, stepName: "Consent"});
    }

    const steper = {
        [OnBoardingRoutes.SIGNING]: <ChoseImport />,
        [OnBoardingRoutes.SIGNING_IMPORT_FILE]: <FileUploadImport />,
        [OnBoardingRoutes.SIGNING_IMPORT_SLASHING_FILE]: <SlashingUploadImport />,
        [OnBoardingRoutes.SIGNING_IMPORT_MNEMONIC]: <SigningKeyImportContainer history={history} />,
        [OnBoardingRoutes.CONFIGURE]: <ConfigureValidatorContainer />,
        [OnBoardingRoutes.PASSWORD]: <CreatePasswordContainer history={history} />,
        [OnBoardingRoutes.CONSENT]: <ConsentContainer history={history} />,
    };

    const step = match.params.step as OnBoardingRoutes;
    return (
        <Background>
            <OnBoardModal history={history} currentStep={parseInt(step.split("_")[0])} steps={steps}>
                {steper[step]}
            </OnBoardModal>
        </Background>
    );
};
