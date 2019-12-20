import React, {Component, ReactElement} from "react";
import {Link, RouteComponentProps} from "react-router-dom";
import {ButtonPrimary} from "../../../../components/Button/ButtonStandard";
import {MnemonicCopyField} from "../../../../components/CopyField/CopyField";
import {Routes, OnBoardingRoutes} from "../../../../constants/routes";
import {clipboard} from "electron";
import {Eth2HDWallet} from "../../../../services/wallet";
import {connect} from "react-redux";
import {storeSigningKeyMnemonicAction} from "../../../../actions";
import {bindActionCreators, Dispatch} from "redux";

interface IState {
    mnemonic: string;
}

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
    storeMnemonic: typeof storeSigningKeyMnemonicAction;
}

class SigningMnemonic extends Component<IOwnProps & IInjectedProps, IState> {
    public state = {
        mnemonic: Eth2HDWallet.generate(),
    };
    
    public render(): ReactElement {
        const {mnemonic} = this.state;
        return (
            <>
                <h1>Here’s your special signing key mnemonic</h1>
                <p>This is yours and yours only! Please store it somewhere safe, 
                    like physically writing it down with pen and paper. 
                    You should never store your key in a note-taking app like Evernote, 
                    including cloud storage apps like Dropbox.</p>
                <MnemonicCopyField
                    value={mnemonic}
                    onCopy={(): void => clipboard.writeText(mnemonic)}
                />
                <Link to={Routes.ONBOARD_ROUTE_EVALUATE(OnBoardingRoutes.SIGNING_KEY_VALIDATE)}>
                    <ButtonPrimary 
                        onClick={(): void => {this.props.storeMnemonic(mnemonic);}}
                        buttonId="savedMnemonic"
                    >I SAVED THIS MNEMONIC</ButtonPrimary>
                </Link>
            </>
        );
    }
}

const mapDispatchToProps = (dispatch: Dispatch): IInjectedProps =>
    bindActionCreators(
        {
            storeMnemonic: storeSigningKeyMnemonicAction,
        },
        dispatch
    );

export const SigningKeyGenerateContainer = connect(
    null,
    mapDispatchToProps
)(SigningMnemonic);