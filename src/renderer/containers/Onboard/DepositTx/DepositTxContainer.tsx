import React, {Component, ReactElement} from "react";
import {ButtonPrimary, ButtonSecondary} from "../../../components/Button/ButtonStandard";
import {CopyField} from "../../../components/CopyField/CopyField";
import {Dropdown} from "../../../components/Dropdown/Dropdown";
import {connect} from "react-redux";
import {RouteComponentProps} from "react-router";
import {copyToClipboard} from "../../../services/utils/clipboard-utils";
import {bindActionCreators, Dispatch} from "redux";
import {generateDepositAction, resetDepositData, verifyDepositAction} from "../../../actions";
import {IRootState} from "../../../reducers";
import {OnBoardingRoutes, Routes} from "../../../constants/routes";
import {networks} from "../../../services/deposit/networks";
import {Loading} from "../../../components/Loading/Loading";

/**
 * required own props
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IOwnProps extends Pick<RouteComponentProps, "history"> {
}

interface IInjectedActions {
    generateDepositTxData: typeof generateDepositAction;
    verifyDeposit: typeof verifyDepositAction;
    resetDepositState: typeof resetDepositData;
}

interface IInjectedState {
    waitingForDeposit: boolean;
    depositTxData: string;
    isDepositGenerated: boolean;
    isDepositDetected: boolean;
}

/**
 * injected by redux
 */
type IInjectedProps = IInjectedState & IInjectedActions;


export default class DepositTxComponent extends Component<IOwnProps & IInjectedProps, {selectedNetworkIndex: number}> {

    public state = {
        selectedNetworkIndex: 0,
    };

    public componentDidMount(): void {
        this.props.generateDepositTxData(networks[this.state.selectedNetworkIndex]);
    }

    public shouldComponentUpdate(nextProps: Readonly<IOwnProps & IInjectedProps>): boolean {
        if(nextProps.isDepositDetected) {
            this.props.resetDepositState();
            this.onwards();
            return false;
        }
        return true;
    }


    public onNetworkChange = (selected: number): void => {
        // Generate transaction data
        this.props.generateDepositTxData(networks[selected]);

        this.setState({
            selectedNetworkIndex: selected
        });
    };

    // TODO Maybe add some loader becase generating transaction data takes some time
    // there is flag in redux "isDepositGenerated"
    public render(): ReactElement {
        const networkOptions = networks.map((contract) => { return contract.networkName; });
        const selectedContract = networks[this.state.selectedNetworkIndex];

        return (
            <>
                <h1>Deposit transaction</h1>
                <p>Execute this transaction from your ETH1 wallet of choice along with 32 ETH to become validator.</p>
                <div className="deposit-details-container">
                    <Dropdown
                        label="Network"
                        current={this.state.selectedNetworkIndex}
                        onChange={this.onNetworkChange}
                        options={networkOptions} />
                    <CopyField
                        label="Deposit contract"
                        value={selectedContract.contract.address}
                        onCopy={(): void => copyToClipboard(selectedContract.contract.address)} />
                    <CopyField
                        label="Transaction data"
                        value={this.props.depositTxData}
                        onCopy={(): void => copyToClipboard(this.props.depositTxData)} />
                </div>
                <div className="deposit-action-buttons">
                    <ButtonSecondary
                        buttonId="skip"
                        onClick={this.onwards}
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

                <Loading visible={!this.props.isDepositGenerated}/>
                <Loading visible={this.props.waitingForDeposit} title="Waiting for eth1 deposit transaction"/>
            </>
        );
    }

    private onwards = (): void => {
        this.props.history.push(Routes.ONBOARD_ROUTE_EVALUATE(OnBoardingRoutes.PASSWORD));
    };

    private handleVerify = (): void => {
        const {selectedNetworkIndex} = this.state;
        this.props.verifyDeposit(networks[selectedNetworkIndex]);
    };
}

const mapStateToProps = ({deposit}: IRootState): IInjectedState => ({
    waitingForDeposit: deposit.waitingForDeposit,
    depositTxData: deposit.depositTxData,
    isDepositGenerated: deposit.depositTxData !== null,
    isDepositDetected: deposit.isDepositDetected
});

const mapDispatchToProps = (dispatch: Dispatch): IInjectedActions =>
    bindActionCreators(
        {
            generateDepositTxData: generateDepositAction,
            verifyDeposit: verifyDepositAction,
            resetDepositState: resetDepositData
        },
        dispatch
    );

export const DepositTxContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(DepositTxComponent);