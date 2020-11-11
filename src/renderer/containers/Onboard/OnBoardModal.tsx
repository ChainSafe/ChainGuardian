import React, {Component, ReactElement} from "react";
import {Modal} from "../../components/Modal/Modal";
import {StepNavigation} from "../../components/StepNavigation/StepNavigation";
import {History} from "history";

interface IOnBoardModalProps {
    history: History;
    currentStep: number;
    steps?: Array<{stepId: number; stepName: string}>;
}

export default class OnBoardModal extends Component<IOnBoardModalProps> {
    public render(): ReactElement {
        const {steps, currentStep, children} = this.props;

        const topBar = steps ? <StepNavigation steps={steps} current={currentStep} /> : null;

        return (
            <Modal hasBack onBack={this.handleBack} topBar={topBar}>
                {children}
            </Modal>
        );
    }

    private handleBack = (): void => {
        this.props.history.goBack();
    };
}
