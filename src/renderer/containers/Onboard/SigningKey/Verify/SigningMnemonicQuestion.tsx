import React, {Component, ReactElement} from "react";
import {connect} from "react-redux";
import {RouteComponentProps} from "react-router";
import {bindActionCreators, Dispatch} from "redux";

import {VerifyMnemonic} from "../../../../components/VerifyMnemonic/VerifyMnemonic";
import {getRandomInt, getRandomIntArray} from "../../../../services/mnemonic/utils/random";
import {IRootState} from "../../../../reducers";
import {storeSigningKeyAction} from "../../../../actions";
import {Eth2HDWallet} from "../../../../services/wallet";
import {OnBoardingRoutes, Routes} from "../../../../constants/routes";
import {storeSigningMnemonicVerificationStatusAction} from "../../../../actions";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IOwnProps extends Pick<RouteComponentProps, "history"> {

}
interface IInjectedProps {
    setVerificationStatus: typeof storeSigningMnemonicVerificationStatusAction;
}

class SigningMnemonicQuestion extends Component<IOwnProps &  Pick<IRootState, "register"> & IInjectedProps, {}> {
    public render(): ReactElement {
        const mnemonic = this.props.register.mnemonic.split(" ");
        const randArray = getRandomIntArray(12);
        const correctAnswerIndex = randArray[getRandomInt(3)];

        const handleInvalidAnswer = (): void => {
            this.props.setVerificationStatus(true);
            this.props.history.goBack();
        };

        return (
            <VerifyMnemonic
                question={`What’s the ${correctAnswerIndex + 1}th word in the mnemonic?`}
                answers={[mnemonic[randArray[0]], mnemonic[randArray[1]], mnemonic[randArray[2]]]}
                correctAnswer={mnemonic[correctAnswerIndex]}
                onCorrectAnswer={this.onCorrectAnswer}
                onInvalidAnswer={(): void => {setTimeout(handleInvalidAnswer, 1000);}}
            />
        );
    }

    private onCorrectAnswer = (): void => {
        const {register, storeSigningKey, history} = this.props;

        const signingKey = Eth2HDWallet.getKeypair(register.mnemonic).privateKey.toHexString();
        storeSigningKey(signingKey);

        history.replace(Routes.ONBOARD_ROUTE_EVALUATE(OnBoardingRoutes.WITHDRAWAL));
    };
}

// redux

interface IInjectedProps {
    storeSigningKey: typeof storeSigningKeyAction;
}

const mapStateToProps = (state: IRootState): Pick<IRootState, "register"> => ({
    register: state.register
});

const mapDispatchToProps = (dispatch: Dispatch): IInjectedProps =>
    bindActionCreators({
        storeSigningKey: storeSigningKeyAction,
        setVerificationStatus: storeSigningMnemonicVerificationStatusAction,
    }, dispatch);

export const SigningKeyVerifyContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(SigningMnemonicQuestion);
