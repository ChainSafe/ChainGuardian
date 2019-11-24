import React, {Component, ReactElement} from "react";
import {ButtonPrimary, ButtonSecondary} from "../../../components/Button/ButtonStandard";
import {History} from "history";
import {CopyField} from "../../../components/CopyField/CopyField";
import {Dropdown} from "../../../components/Dropdown/Dropdown";
import {generateDeposit, DepositTx} from "../../../services/deposit";
import {Keypair} from "@chainsafe/bls/lib/keypair";
import {config as mainnetBeaconConfig} from "@chainsafe/eth2.0-config/lib/presets/mainnet";
import {config as minimalBeaconConfig} from "@chainsafe/eth2.0-config/lib/presets/minimal";
import {IBeaconConfig} from "@chainsafe/eth2.0-config";

const depositContracts = [
    {networkName: "Mainnet", address: "0x00000000000001", beaconConfig: mainnetBeaconConfig},
    {networkName: "Minimal", address: "0x00000000000002", beaconConfig: minimalBeaconConfig},
];

const VALIDATOR_DEPOSIT_AMOUNT = "32";

const generateDepositTxData = (depositContractAddress: string, config: IBeaconConfig): string => {
    // TODO: Plug in singingKey, 
    const depositData = generateDeposit(
        Keypair.generate(),
        Buffer.from("0x00000000000000"),
        VALIDATOR_DEPOSIT_AMOUNT
    );
    // TODO: replace the config?
    const depositTx = DepositTx.generateDepositTx(
        depositData,
        depositContractAddress,
        config,
        VALIDATOR_DEPOSIT_AMOUNT
    );

    if(typeof depositTx.data === "object"){
        return "0x" + depositTx.data.toString("hex"); 
    }
    return "0x" + depositTx.data;
};
    
export default class DepositTxContainer extends Component<{ history: History }, {}> {
    
    public state = {
        selectedNetworkIdx: 0,
        selectedContractAddress: depositContracts[0].address,
        transactionData: generateDepositTxData(depositContracts[0].address, depositContracts[0].beaconConfig)
    };

    public onNetworkChange = (selected: number): void => {
        const newSelectedContractAddress = depositContracts[selected].address;
        // Generate transaction data
        const depositTxData = generateDepositTxData(
            newSelectedContractAddress,
            depositContracts[selected].beaconConfig
        );

        this.setState({
            selectedNetworkIdx: selected,
            selectedContractAddress: newSelectedContractAddress,
            transactionData: depositTxData
        });
    };

    public render(): ReactElement {
        const networkOptions = depositContracts.map((contract) => {return contract.networkName;});
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
