import React, {Component, ReactElement} from "react";
import {InputForm} from "../../../components/Input/InputForm";
import {ButtonPrimary, ButtonSecondary} from "../../../components/Button/ButtonStandard";
import {History} from "history";
import { CopyField } from "../../../components/CopyField/CopyField";
import { Dropdown } from "../../../components/Dropdown/Dropdown";

const options = ["All networks","Mainnet","Testnet","Networkname #1"];
    
export default class DepositTxContainer extends Component<{ history: History }, {}> {
    public state = {
        current: 0
    }
    public render(): ReactElement {
        return (
            <>
                <h1>Deposit transaction</h1>
                <p>Execute this transaction from your ETH1 wallet of choice along with 32 ETH to become validator.</p>
                <div className="deposit-details-container">
                    <Dropdown
                        label="Network" 
                        current={this.state.current} 
                        onChange={(selected: number)=>{this.setState({current: selected})}} 
                        options={options}
                    />
                    <CopyField
                        label="Deposit contract"
                        value={"0x9232312392323123"} />
                    <CopyField
                        label="Transaction data"
                        value={"0x9232312392323123923231239232312392323123923231239232312392323123923231239232312392323123923231239232312392321239232312392323123"} />
                </div>
                <div className="deposit-action-buttons">
                    <ButtonSecondary buttonId="skip">SKIP</ButtonSecondary>
                    <ButtonPrimary buttonId="verify">Verify</ButtonPrimary>
                </div>
            </>
        );
    }
}
