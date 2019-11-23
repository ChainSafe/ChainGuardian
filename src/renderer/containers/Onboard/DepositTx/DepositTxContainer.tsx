import React, {Component, ReactElement} from "react";
import {ButtonPrimary, ButtonSecondary} from "../../../components/Button/ButtonStandard";
import {History} from "history";
import { CopyField } from "../../../components/CopyField/CopyField";
import { Dropdown } from "../../../components/Dropdown/Dropdown";
import { generateDeposit, DepositTx } from "../../../services/deposit";
import { Keypair } from "@chainsafe/bls/lib/keypair";
import { config } from "@chainsafe/eth2.0-config/lib/presets/mainnet";

const depositContracts = [
    {networkName: "Mainnet", address: "0x00000000000001"},
    {networkName: "Testnet", address: "0x00000000000002"},
    {networkName: "Networkname #1", address: "0x00000000000003"},
]

const VALIDATOR_DEPOSIT_AMOUNT = "32";
    
export default class DepositTxContainer extends Component<{ history: History }, {}> {
    
    generateDepositTxData = (depositContractAddress: string): string => {
        // TODO: Plug in singingKey, 
        const depositData = generateDeposit(Keypair.generate(), Buffer.from("0x00000000000000"), VALIDATOR_DEPOSIT_AMOUNT);
        // TODO: replace the config?
        const depositTx = DepositTx.generateDepositTx(depositData, depositContractAddress, config, VALIDATOR_DEPOSIT_AMOUNT);

        if(typeof depositTx.data === "object"){
            return "0x" + depositTx.data.toString("hex"); 
        }
        return "0x" + depositTx.data;
    }
    
    public state = {
        selectedNetworkIdx: 0,
        selectedContractAddress: depositContracts[0].address,
        transactionData: this.generateDepositTxData(depositContracts[0].address)
    }

    onNetworkChange = (selected: number) => {
        const newSelectedContractAddress = depositContracts[selected].address;
        // Generate transaction data
        const depositTxData = this.generateDepositTxData(newSelectedContractAddress);

        this.setState({
            selectedNetworkIdx: selected,
            selectedContractAddress: newSelectedContractAddress,
            transactionData: depositTxData
        });
    }

    public render(): ReactElement {
        const networkOptions = depositContracts.map((contract) => {return contract.networkName});
        return (
            <>
                <h1>Deposit transaction</h1>
                <p>Execute this transaction from your ETH1 wallet of choice along with 32 ETH to become validator.</p>
                <div className="deposit-details-container">
                    <Dropdown
                        label="Network" 
                        current={this.state.selectedNetworkIdx} 
                        onChange={this.onNetworkChange} 
                        options={networkOptions}
                    />
                    <CopyField
                        label="Deposit contract"
                        value={depositContracts[this.state.selectedNetworkIdx].address} />
                    <CopyField
                        label="Transaction data"
                        value={this.state.transactionData} />
                </div>
                <div className="deposit-action-buttons">
                    <ButtonSecondary buttonId="skip">SKIP</ButtonSecondary>
                    <ButtonPrimary buttonId="verify">Verify</ButtonPrimary>
                </div>
            </>
        );
    }
}
