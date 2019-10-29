import React, { Component } from 'react'
import { Modal } from "../../components/Modal/Modal";
import { StepNavigation } from '../../components/StepNavigation/StepNavigation';

const steps = [
    { stepId: 1, stepName: "Signing key" },
    { stepId: 2, stepName: "Withdrawal key" },
    { stepId: 3, stepName: "Password" },
    { stepId: 4, stepName: "Configure" },
    { stepId: 5, stepName: "Consent" }
];


export default class OnBoardModal extends Component<{ history: any, currentStep: number }, {}> {

    private handleBack = (): void => {
        this.props.history.goBack();
    };

    render() {

        const topBar = <StepNavigation steps={steps} current={this.props.currentStep} />;

        return (
            <Modal hasBack onBack={this.handleBack} topBar={topBar}>
                {this.props.children}
            </Modal>
        )
    }
}
