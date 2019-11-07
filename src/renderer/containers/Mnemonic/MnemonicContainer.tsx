import React, {Component, ReactElement} from "react";
import {Background} from "../../components/Background/Background";
import {Modal} from "../../components/Modal/Modal";
import {ButtonPrimary} from "../../components/Button/ButtonStandard";
import {MnemonicCopyField} from "../../components/CopyField/CopyField";
import {StepNavigation} from "../../components/StepNavigation/StepNavigation";
import {RouteComponentProps} from "react-router";

const steps = [
    {stepId: 1, stepName: "Signing key"},
    {stepId: 2, stepName: "Withdrawal key"},
    {stepId: 3, stepName: "Password"},
    {stepId: 4, stepName: "Configure"},
    {stepId: 5, stepName: "Consent"}
];

interface IState {
    mnemonicValue: string;
}

export default class MnemonicContainer extends Component<RouteComponentProps, {}> {
    public state: IState = {
        mnemonicValue: "test test"
    };
    public copyMnemonic = (mnemonic: string): void => {
        const element = document.createElement("textarea");
        element.value = mnemonic;
        element.setAttribute("readonly", "");
        element.style.cssText = "position: absolute; left: -9999px;";
        document.body.appendChild(element);
        element.select();
        document.execCommand("copy");
        document.body.removeChild(element);
    };

    public render(): ReactElement {

        const topBar = <StepNavigation steps={steps} current={1} />;

        return (
            <Background>
                <Modal hasBack onBack={this.handleBack} topBar={topBar}>
                    <h1>Here’s your special signing key mnemonic</h1>
                    <p>This is yours and yours only! Please store it somewhere safe, like physically writing it down with pen and paper. You should never store your key in a note-taking app like Evernote, including cloud storage apps like Dropbox.</p>
                    <MnemonicCopyField value={this.state.mnemonicValue} onCopy={()=>this.copyMnemonic(this.state.mnemonicValue)}></MnemonicCopyField>
                    <ButtonPrimary buttonId="savedMnemonic">I SAVED THIS MNEMONIC</ButtonPrimary>
                </Modal>
            </Background>
        );
    }

    private handleBack = (): void => {
        this.props.history.goBack();
    };
}
