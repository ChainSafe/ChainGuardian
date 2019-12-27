import React, {Component, ReactElement} from "react";
import {connect} from "react-redux";
import {RouteComponentProps} from "react-router";
import {bindActionCreators, Dispatch} from "redux";
import {VerifyMnemonic} from "../../../../components/VerifyMnemonic/VerifyMnemonic";
import {getRandomInt, getRandomIntArray} from "../../../../services/mnemonic/utils/random";
import {ordinalSuffix} from "../../../../services/mnemonic/utils/ordinalSuffix";
import {IRootState} from "../../../../reducers";
import {storeSigningVerificationStatusAction,storeSigningKeyAction} from "../../../../actions";
import {Routes, OnBoardingRoutes} from "../../../../constants/routes";
import {Eth2HDWallet} from "../../../../services/wallet";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IOwnProps extends Pick<RouteComponentProps, "history"> {

}

class SigningMnemonicQuestion extends Component<IOwnProps &  Pick<IRootState, "register"> & IInjectedProps, {}> {
    public render(): ReactElement {
        const mnemonic = this.props.register.signingMnemonic.split(" ");
        const randArray = getRandomIntArray(12);
        const correctAnswerIndex = randArray[getRandomInt(3)];

        return (
            <VerifyMnemonic
                question={`What’s the ${ordinalSuffix(correctAnswerIndex+1)} word in the mnemonic?`}
                answers={[mnemonic[randArray[0]], mnemonic[randArray[1]], mnemonic[randArray[2]]]}
                correctAnswer={mnemonic[correctAnswerIndex]}
                onCorrectAnswer={(): void => {setTimeout(this.handleCorrectAnswer, 1000);}}
                onInvalidAnswer={(): void => {setTimeout(this.handleInvalidAnswer, 1000);}}
            />
        );
    }

    private handleCorrectAnswer = (): void => {
        const {register, storeSigningKey, history} = this.props;

        const signingKey = Eth2HDWallet.getKeypair(register.signingMnemonic).privateKey.toHexString();
        storeSigningKey(signingKey);

        history.replace(Routes.ONBOARD_ROUTE_EVALUATE(OnBoardingRoutes.WITHDRAWAL));
    };

    private handleInvalidAnswer = (): void => {
        this.props.setVerificationStatus(true);
        this.props.history.goBack();
    };
}

// redux

interface IInjectedProps {
    storeSigningKey: typeof storeSigningKeyAction;
    setVerificationStatus: typeof storeSigningVerificationStatusAction;
}

const mapStateToProps = (state: IRootState): Pick<IRootState, "register"> => ({
    register: state.register
});

const mapDispatchToProps = (dispatch: Dispatch): IInjectedProps =>
    bindActionCreators({
        storeSigningKey: storeSigningKeyAction,
        setVerificationStatus: storeSigningVerificationStatusAction,
    }, dispatch);

export const SigningKeyVerifyContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(SigningMnemonicQuestion);
