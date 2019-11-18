import React, {Component, ReactElement} from "react";
import {Background} from "../../components/Background/Background";
import {Modal} from "../../components/Modal/Modal";
import {InputForm} from "../../components/Input/InputForm";
import {ButtonPrimary, ButtonSecondary} from "../../components/Button/ButtonStandard";
import {StepNavigation} from "../../components/StepNavigation/StepNavigation";

const steps = [
    {stepId: 1, stepName: "Signing key"},
    {stepId: 2, stepName: "Withdrawal key"},
    {stepId: 3, stepName: "Password"},
    {stepId: 4, stepName: "Configure"},
    {stepId: 5, stepName: "Deposit"},
    {stepId: 6, stepName: "Consent"}
];

export default class DepositTxContainer extends Component<{history: any}, {}> {

    public render(): ReactElement {

        const topBar = <StepNavigation steps={steps} current={5} />;

        return (
            <Background>
                <Modal hasBack onBack={this.handleBack} topBar={topBar}>
                    <h1>Deposit transaction</h1>
                    <p>Execute this transaction from your ETH1 wallet of choice along with 32 ETH to become validator.</p>
                    <div className="deposit-details-container">
                        <InputForm
                            label="Deposit contract"
                            inputId="depositContractAddressInput"
                            readOnly={true}
                            inputValue={"0x92323123"}  />
                        <InputForm
                            label="Transaction data"
                            inputId="transactionDataInput"
                            readOnly={true}
                            inputValue={"0x92323123"}  />
                    </div>
                    <div className="deposit-action-buttons">
                        <ButtonSecondary buttonId="skip">SKIP</ButtonSecondary>
                        <ButtonPrimary buttonId="verify">Verify</ButtonPrimary>
                    </div>
                </Modal>
            </Background >
        );
    }

    private handleBack = (): void => {
        this.props.history.goBack();
    };
}
