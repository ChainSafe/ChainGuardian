import React, {Component, ReactElement} from "react";
import {Link, RouteComponentProps} from "react-router-dom";
import {ButtonPrimary} from "../../../../components/Button/ButtonStandard";
import {MnemonicCopyField} from "../../../../components/CopyField/CopyField";
import {Routes, OnBoardingRoutes} from "../../../../constants/routes";
import {clipboard} from "electron";
import {Eth2HDWallet} from "../../../../services/wallet";
import {connect} from "react-redux";
import {storeSigningMnemonicAction,storeSigningVerificationStatusAction} from "../../../../actions";
import {bindActionCreators, Dispatch} from "redux";
import {Notification} from "../../../../components/Notification/Notification"; 
import {Level, Horizontal, Vertical} from "../../../../components/Notification/NotificationEnums"; 
import {IRootState} from "../../../../reducers";

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
    storeMnemonic: typeof storeSigningMnemonicAction;
    setVerificationStatus: typeof storeSigningVerificationStatusAction;
}

class SigningMnemonic extends Component<IOwnProps & IInjectedProps &  Pick<IRootState, "register">, IState> {
    public state = {
        mnemonic: Eth2HDWallet.generate(),
    };
    
    public render(): ReactElement {
        const {mnemonic} = this.state;
        return (
            <>
                <Notification
                    title="Oh no! That wasn’t the correct word."
                    isVisible={this.props.register.signingVerification}
                    level={Level.ERROR}
                    horizontalPosition={Horizontal.CENTER}
                    verticalPosition={Vertical.TOP}
                    onClose={(): void => {this.props.setVerificationStatus(false);}}
                >
                    Please make sure you have saved your unique mnemonic in a safe location
                     that you can quickly refer to and try again.
                </Notification>
                <h1>Here’s your special signing key mnemonic</h1>
                <p className="mnemonic-paragraph">This is yours and yours only! Please store it somewhere safe, 
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
                        buttonId="savedSigningMnemonic"
                    >I SAVED THIS MNEMONIC</ButtonPrimary>
                </Link>
            </>
        );
    }
}
const mapStateToProps = (state: IRootState): Pick<IRootState, "register"> => ({
    register: state.register
});
const mapDispatchToProps = (dispatch: Dispatch): IInjectedProps =>
    bindActionCreators(
        {
            storeMnemonic: storeSigningMnemonicAction,
            setVerificationStatus: storeSigningVerificationStatusAction,
        },
        dispatch
    );

export const SigningKeyGenerateContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(SigningMnemonic);