import React, {Component, ReactElement} from "react";
import {Modal} from "../../components/Modal/Modal";
import {StepNavigation} from "../../components/StepNavigation/StepNavigation";
import {History} from "history";

const steps = [
    {stepId: 1, stepName: "Signing key"},
    {stepId: 2, stepName: "Withdrawal key"},
    {stepId: 3, stepName: "Configure"},
    {stepId: 4, stepName: "Deposit"},
    {stepId: 5, stepName: "Password"},
    {stepId: 6, stepName: "Consent"}
];


export default class OnBoardModal extends Component<{ history: History, currentStep: number }, {}> {
    public render(): ReactElement {

        const topBar = <StepNavigation steps={steps} current={this.props.currentStep} />;

        return (
            <Modal hasBack onBack={this.handleBack} topBar={topBar}>
                {this.props.children}
            </Modal>
        );
    }

    private handleBack = (): void => {
        this.props.history.goBack();
    };
}
