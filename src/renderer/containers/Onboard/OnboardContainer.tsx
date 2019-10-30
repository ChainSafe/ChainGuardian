import React, {Component, ReactElement} from "react";
import {Background} from "../../components/Background/Background";
import {Modal} from "../../components/Modal/Modal";
import {ButtonPrimary, ButtonSecondary} from "../../components/Button/ButtonStandard";
import {StepNavigation} from "../../components/StepNavigation/StepNavigation";
import { RouteComponentProps } from "react-router";

const steps = [
    {stepId: 1, stepName: "Signing key"},
    {stepId: 2, stepName: "Withdrawal key"},
    {stepId: 3, stepName: "Password"},
    {stepId: 4, stepName: "Configure"},
    {stepId: 5, stepName: "Consent"}
];

export default class OnboardContainer extends Component<RouteComponentProps, {}> {

    public render(): ReactElement {

        const topBar = <StepNavigation steps={steps} current={1} />;

        return (
            <Background>
                <Modal hasBack onBack={this.handleBack} topBar={topBar}>
                    <h1>Enter your signing key</h1>
                    <p>You’ll need this for signing blocks and attestations on your behalf</p>
                    <div className="action-buttons">
                        <ButtonSecondary buttonId="import" large>IMPORT</ButtonSecondary>
                        <ButtonPrimary buttonId="generate" large>GENERATE</ButtonPrimary>
                    </div>
                </Modal>
            </Background >
        );
    }

    private handleBack = (): void => {
        this.props.history.goBack();
    };
}
