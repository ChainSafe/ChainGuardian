import React, {Component, ReactElement} from "react";
import {ButtonPrimary, ButtonSecondary} from "../../../components/Button/ButtonStandard";
import {CopyField} from "../../../components/CopyField/CopyField";
import {Dropdown} from "../../../components/Dropdown/Dropdown";
import {connect} from "react-redux";
import {RouteComponentProps} from "react-router";
import {copyToClipboard} from "../../../services/utils/clipboard";
import {bindActionCreators, Dispatch} from "redux";
import {OnBoardingRoutes, Routes} from "../../../constants/routes";
import {networks} from "../../../services/eth2/networks";
import {Loading} from "../../../components/Loading/Loading";
import {IRootState} from "../../../ducks/reducers";
import {generateDeposit, verifyDeposit, resetDepositData} from "../../../ducks/deposit/actions";
import {getDepositTxData, getIsDepositDetected, getWaitingForDeposit} from "../../../ducks/deposit/selectors";
import {getRegisterWithdrawalKey, getNetworkIndex} from "../../../ducks/register/selectors";

/**
 * required own props
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IOwnProps extends Pick<RouteComponentProps, "history"> {
}

interface IInjectedActions {
    generateDepositTxData: typeof generateDeposit;
    verifyDeposit: typeof verifyDeposit;
    resetDepositState: typeof resetDepositData;
}

interface IInjectedState {
    waitingForDeposit: boolean;
    depositTxData: string;
    isDepositGenerated: boolean;
    isDepositDetected: boolean;
    networkIndex: number;
    canDeposit: boolean;
}

/**
 * injected by redux
 */
type IInjectedProps = IInjectedState & IInjectedActions;


class DepositTxComponent extends Component<IOwnProps & IInjectedProps> {
    public componentDidMount(): void {
        this.props.generateDepositTxData(networks[this.props.networkIndex]);
    }

    public shouldComponentUpdate(nextProps: Readonly<IOwnProps & IInjectedProps>): boolean {
        if(nextProps.isDepositDetected) {
            this.props.resetDepositState();
            this.onwards();
            return false;
        }
        return true;
    }

    // eslint-disable-next-line camelcase
    public UNSAFE_componentWillMount(): void {
        if (!this.props.canDeposit) {
            this.onwards();
        }
    }

    // TODO Maybe add some loader becase generating transaction data takes some time
    // there is flag in redux "isDepositGenerated"
    public render(): ReactElement {
        const selectedContract = networks[this.props.networkIndex];

        return (
            <>
                <h1>Deposit transaction</h1>
                <p>Execute this transaction from your ETH1 wallet of choice along with 32 ETH to become validator.</p>
                <div className="deposit-details-container">
                    <Dropdown
                        label="Network"
                        current={0}
                        options={[selectedContract.networkName]}
                    />

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
        const {history} = this.props;
        return history.push(Routes.ONBOARD_ROUTE_EVALUATE(OnBoardingRoutes.PASSWORD));
    };

    private handleVerify = (): void => {
        const {networkIndex} = this.props;
        this.props.verifyDeposit(networks[networkIndex]);
    };
}

const mapStateToProps = (state: IRootState): IInjectedState => ({
    networkIndex: getNetworkIndex(state),
    waitingForDeposit: getWaitingForDeposit(state),
    depositTxData: getDepositTxData(state),
    isDepositGenerated: getDepositTxData(state) !== null,
    isDepositDetected: getIsDepositDetected(state),
    canDeposit: !!getRegisterWithdrawalKey(state),
});

const mapDispatchToProps = (dispatch: Dispatch): IInjectedActions =>
    bindActionCreators(
        {
            generateDepositTxData: generateDeposit,
            verifyDeposit: verifyDeposit,
            resetDepositState: resetDepositData
        },
        dispatch
    );

export const DepositTxContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(DepositTxComponent);
