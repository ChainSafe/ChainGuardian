import React, { Component, ReactElement } from "react";
import { ButtonPrimary, ButtonSecondary } from "../../../components/Button/ButtonStandard";
import { CopyField } from "../../../components/CopyField/CopyField";
import { Dropdown } from "../../../components/Dropdown/Dropdown";
import { connect } from "react-redux";
import { config as mainnetBeaconConfig } from "@chainsafe/eth2.0-config/lib/presets/mainnet";
import { config as minimalBeaconConfig } from "@chainsafe/eth2.0-config/lib/presets/minimal";
import { RouteComponentProps } from "react-router";
import { copyToClipboard } from "../../../services/utils/clipboard-utils";
import { bindActionCreators, Dispatch } from "redux";
import { generateDepositAction, verifyDepositAction } from "../../../actions";
import { INetworkConfig } from "../../../services/interfaces";
import { IRootState } from "../../../reducers";
import { Routes, OnBoardingRoutes } from "../../../constants/routes";

const depositContracts = [
    { networkName: "Mainnet", address: "0x00000000000001", beaconConfig: mainnetBeaconConfig },
    { networkName: "Minimal", address: "0x00000000000002", beaconConfig: minimalBeaconConfig },
];

const VALIDATOR_DEPOSIT_AMOUNT = "32";

/**
 * required own props
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IOwnProps extends Pick<RouteComponentProps, "history"> {
}

/**
 * injected by redux
 */
interface IInjectedProps {
    generateDepositTxData: typeof generateDepositAction;
    verifyDeposit: typeof verifyDepositAction;
}


export default class DepositTxComponent extends
    Component<IOwnProps & IInjectedProps & Pick<IRootState, "deposit">, {}> {

    public state = {
        selectedNetworkIdx: 0,
        selectedContractAddress: depositContracts[0].address
    };

    public componentDidMount(): void {
        this.props.generateDepositTxData({
            contract: {
                address: depositContracts[0].address
            },
            config: depositContracts[0].beaconConfig
        } as INetworkConfig,
            VALIDATOR_DEPOSIT_AMOUNT);
    }


    public onNetworkChange = (selected: number): void => {
        const newSelectedContractAddress = depositContracts[selected].address;
        // Generate transaction data
        this.props.generateDepositTxData({
            contract: {
                address: newSelectedContractAddress
            },
            config: depositContracts[selected].beaconConfig
        } as INetworkConfig,
            VALIDATOR_DEPOSIT_AMOUNT);

        this.setState({
            selectedNetworkIdx: selected,
            selectedContractAddress: newSelectedContractAddress,
        });
    };
    // TODO Maybe add some loader becase generating transaction data takes some time
    // there is flag in redux "isDepositGenerated"
    public render(): ReactElement {
        const networkOptions = depositContracts.map((contract) => { return contract.networkName; });
        const selectedContract = depositContracts[this.state.selectedNetworkIdx];
        const { txData } = this.props.deposit;

        return (
            <>
                <h1>Deposit transaction</h1>
                <p>Execute this transaction from your ETH1 wallet of choice along with 32 ETH to become validator.</p>
                <div className="deposit-details-container">
                    <Dropdown
                        label="Network"
                        current={this.state.selectedNetworkIdx}
                        onChange={this.onNetworkChange}
                        options={networkOptions} />
                    <CopyField
                        label="Deposit contract"
                        value={selectedContract.address}
                        onCopy={(): void => copyToClipboard(selectedContract.address)} />
                    <CopyField
                        label="Transaction data"
                        value={txData}
                        onCopy={(): void => copyToClipboard(txData)} />
                </div>
                <div className="deposit-action-buttons">
                    <ButtonSecondary
                        buttonId="skip"
                        onClick={this.handleSkip}
                    >
                        SKIP
                    </ButtonSecondary>
                    <ButtonPrimary
                        buttonId="verify"
                        onClick={this.handleVerify}
                    >
                        Verify
                    </ButtonPrimary>
                </div>
            </>
        );
    }

    private handleSkip = (): void => {
        this.props.history.push(Routes.ONBOARD_ROUTE_EVALUATE(OnBoardingRoutes.PASSWORD));
    };

    // TODO there is a flag in redux "isDepositVisible" so component should wait until flag is set to true
    private handleVerify = (): void => {
        const { selectedContractAddress, selectedNetworkIdx } = this.state;
        // FIXME  pass network name from select but find names that ether.js supports
        // You can use any standard network name
        //  - "homestead"
        //  - "rinkeby"
        //  - "ropsten"
        //  - "kovan"
        //  - "goerli"
        this.props.verifyDeposit({
            contract: {
                address: selectedContractAddress
            },
            config: depositContracts[selectedNetworkIdx].beaconConfig
        } as INetworkConfig,
            "ropsten")
    };
}

const mapStateToProps = (state: IRootState): Pick<IRootState, "deposit"> => ({
    deposit: state.deposit
});

const mapDispatchToProps = (dispatch: Dispatch): IInjectedProps =>
    bindActionCreators(
        {
            generateDepositTxData: generateDepositAction,
            verifyDeposit: verifyDepositAction
        },
        dispatch
    );

export const DepositTxContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(DepositTxComponent);