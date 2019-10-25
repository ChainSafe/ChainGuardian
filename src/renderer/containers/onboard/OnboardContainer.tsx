import React, {Component} from "react";
import {Background} from "../../components/Background/Background";
import {Modal} from "../../components/Modal/Modal";
import {Redirect} from "react-router-dom";
import {ButtonPrimary, ButtonSecondary} from "../../components/Button/ButtonStandard";
import {StepNavigation} from "../../components/StepNavigation/StepNavigation";

const steps = [
    {stepId: 1, stepName: "Signing key"},
    {stepId: 2, stepName: "Withdrawal key"},
    {stepId: 3, stepName: "Password"},
    {stepId: 4, stepName: "Configure"},
    {stepId: 5, stepName: "Consent"}
];

export default class OnboardContainer extends Component<{}, { isRedirectToMain: boolean }> {

    constructor(props: any) {
        super(props);

        this.state = {
            isRedirectToMain: false
        };

        this.handleBack = this.handleBack.bind(this);
    }


    handleBack = (): void => {
        this.setState({isRedirectToMain: true});
    };

    render(): any {
        const {isRedirectToMain} = this.state;

        if (isRedirectToMain) {
            return <Redirect to='/' />;
        }

        const topBar = <StepNavigation steps={steps} current={1} />;

        return (
            <Background>
                <Modal hasBack onBack={this.handleBack} topBar={topBar}>
                    <h1>Enter your signing key</h1>
                    <p>You’ll need this for signing blocks and attestations on your behalf</p>
                    <div className="action-buttons">
                        <ButtonSecondary large>IMPORT</ButtonSecondary>
                        <ButtonPrimary large>GENERATE</ButtonPrimary>
                    </div>
                </Modal>
            </Background >
        );
    }
}
