import React, {Component, ReactElement} from "react";
import {VerifyMnemonic} from "../../../../components/VerifyMnemonic/VerifyMnemonic";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {RouteComponentProps} from "react-router";
import {getRandomInt, getRandomIntArray} from "../../../../services/mnemonic/utils/random";
import {IRootState} from "../../../../reducers";
import {storeSigningMnemonicVerificationStatusAction} from "../../../../actions";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IOwnProps extends Pick<RouteComponentProps, "history"> {

}
interface IInjectedProps {
    setVerificationStatus: typeof storeSigningMnemonicVerificationStatusAction;
}

class SigningMnemonicQuestion extends Component<IOwnProps & IInjectedProps &  Pick<IRootState, "register">, {}> {
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
                onCorrectAnswer={(): void => {}}
                onInvalidAnswer={(): void => {setTimeout(handleInvalidAnswer, 1000);}}
            />
        );
    }
}

const mapStateToProps = (state: IRootState): Pick<IRootState, "register"> => ({
    register: state.register
});
const mapDispatchToProps = (dispatch: Dispatch): IInjectedProps =>
    bindActionCreators(
        {
            setVerificationStatus: storeSigningMnemonicVerificationStatusAction,
        },
        dispatch
    );

export const SigningKeyVerifyContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(SigningMnemonicQuestion);