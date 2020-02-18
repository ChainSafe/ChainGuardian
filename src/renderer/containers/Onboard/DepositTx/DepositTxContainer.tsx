import React, {Component, ReactElement} from "react";
import {ButtonPrimary, ButtonSecondary} from "../../../components/Button/ButtonStandard";
import {CopyField} from "../../../components/CopyField/CopyField";
import {Dropdown} from "../../../components/Dropdown/Dropdown";
import {connect} from "react-redux";
import {RouteComponentProps} from "react-router";
import {copyToClipboard} from "../../../services/utils/clipboard-utils";
import {bindActionCreators, Dispatch} from "redux";
import {generateDepositAction, verifyDepositAction} from "../../../actions";
import {IRootState} from "../../../reducers";
import {OnBoardingRoutes, Routes} from "../../../constants/routes";
import {networks} from "../../../services/deposit/networks";
import {INetworkConfig} from "../../../services/interfaces";

/**
 * required own props
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IOwnProps {
    network: INetworkConfig;
    deposit: IRootState["deposit"];
}
interface IInjectedProps {
    generateDepositTxData: typeof generateDepositAction;
    verifyDeposit: typeof verifyDepositAction;
}

class DepositTxComponent extends Component<IOwnProps & IInjectedProps & Pick<RouteComponentProps, "history">> {
    public componentDidMount(): void {
        this.props.generateDepositTxData(this.props.network);
    }

    // TODO Maybe add some loader becase generating transaction data takes some time
    // there is flag in redux "isDepositGenerated"
    public render(): ReactElement {
        const selectedContract = this.props.network;
        const {txData} = this.props.deposit;

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
        // FIXME  pass network name from select but find names that ether.js supports
        // You can use any standard network name
        //  - "homestead"
        //  - "rinkeby"
        //  - "ropsten"
        //  - "kovan"
        //  - "goerli"
        this.props.verifyDeposit(this.props.network);
    };
}

const mapStateToProps = (state: IRootState): IOwnProps => {
    const networkIndex = state.register.network ? networks.map(n => n.networkName).indexOf(state.register.network) : 0;

    return {
        deposit: state.deposit,
        network: networks[networkIndex],
    };
};

const mapDispatchToProps = (dispatch: Dispatch): IInjectedProps =>
    bindActionCreators(
        {
            generateDepositTxData: generateDepositAction,
            verifyDeposit: verifyDepositAction,
        },
        dispatch
    );

export const DepositTxContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(DepositTxComponent);