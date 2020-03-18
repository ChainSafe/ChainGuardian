import React, {Component, ReactElement} from "react";
import {ButtonPrimary, ButtonSecondary} from "../../../components/Button/ButtonStandard";
import {CopyField} from "../../../components/CopyField/CopyField";
import {Dropdown} from "../../../components/Dropdown/Dropdown";
import {connect} from "react-redux";
import {RouteComponentProps} from "react-router";
import {RegisterType} from "../../../reducers/register";
import {copyToClipboard} from "../../../services/utils/clipboard";
import {bindActionCreators, Dispatch} from "redux";
import {generateDepositAction, resetDepositData, verifyDepositAction} from "../../../actions";
import {IRootState} from "../../../reducers";
import {OnBoardingRoutes, Routes} from "../../../constants/routes";
import {networks} from "../../../services/eth2/networks";
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
    networkIndex: number;
    canDeposit: boolean;
    isAddingNewValidator: boolean;
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
        const {isAddingNewValidator, history} = this.props;
        if (isAddingNewValidator) {
            return history.push(Routes.CHECK_PASSWORD);
        } else {
            return history.push(Routes.ONBOARD_ROUTE_EVALUATE(OnBoardingRoutes.PASSWORD));
        }
    };

    private handleVerify = (): void => {
        const {networkIndex} = this.props;
        this.props.verifyDeposit(networks[networkIndex]);
    };
}

const mapStateToProps = (state: IRootState): IInjectedState => {
    const {register, deposit} = state;
    const networkIndex = register.network ? networks.map(n => n.networkName).indexOf(register.network) : 0;

    return {
        networkIndex,
        waitingForDeposit: deposit.waitingForDeposit,
        depositTxData: deposit.depositTxData,
        isDepositGenerated: deposit.depositTxData !== null,
        isDepositDetected: deposit.isDepositDetected,
        canDeposit: !!register.withdrawalKey || !!register.withdrawalMnemonic,
        isAddingNewValidator: register.registerType === RegisterType.ADD,
    };
};

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