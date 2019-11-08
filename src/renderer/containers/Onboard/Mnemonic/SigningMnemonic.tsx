import React, {Component, ReactElement} from "react";
import {Link} from "react-router-dom";
import {ButtonPrimary} from "../../../components/Button/ButtonStandard";
import {MnemonicCopyField} from "../../../components/CopyField/CopyField";
import {History} from "history";
import {Routes, OnBoardingRoutes} from "../../../constants/routes";
import {clipboard} from "electron";
import store from "../../../store/index";
import {addMnemonic} from "../../../actions/index";
import {generate} from "../../../services/wallet/eth2";

interface IState {
    mnemonicValue: string;
}
// console.log(generate());
export default class SigningMnemonic extends Component<{ history: History }, {}> {
    public state: IState = {
        // mnemonicValue: generate()
        mnemonicValue: "hold solve hurdle seed paper rely fog burden potato portion column festival"
    };
    

    public saveMnemonic = (): void=> {
        store.dispatch( addMnemonic(this.state.mnemonicValue.split(" ")));
    };

    public render(): ReactElement {
        return (
            <>
                <h1>Here’s your special signing key mnemonic</h1>
                <p>This is yours and yours only! Please store it somewhere safe, 
                    like physically writing it down with pen and paper. 
                    You should never store your key in a note-taking app like Evernote, 
                    including cloud storage apps like Dropbox.</p>
                <MnemonicCopyField 
                    value={this.state.mnemonicValue} 
                    onCopy={(): void=>clipboard.writeText(this.state.mnemonicValue)}
                ></MnemonicCopyField>
                <Link to={Routes.ONBOARD_ROUTE_EVALUATE(OnBoardingRoutes.SIGNING_MNEMONIC_QUESTION)}>
                    <ButtonPrimary 
                        onClick={(): void=> this.saveMnemonic()} 
                        buttonId="savedMnemonic"
                    >I SAVED THIS MNEMONIC</ButtonPrimary>
                </Link>
            </>
        );
    }

}
