import React, {Component, ReactElement} from "react";
import {VerifyMnemonic} from "../../../../components/VerifyMnemonic/VerifyMnemonic";
import {connect} from "react-redux";
import {RouteComponentProps} from "react-router";
import {getRandomInt, getRandomIntArray} from "../../../../services/mnemonic/utils/random";
import {IRootState} from "../../../../reducers";
import { bindActionCreators, Dispatch } from 'redux';
import { storeSigningKeyAction } from '../../../../actions';
import { Eth2HDWallet } from '../../../../services/wallet';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IProps extends Pick<RouteComponentProps, "history"> {

}

class SigningMnemonicQuestion extends Component<IProps &  Pick<IRootState, "register"> & IInjectedProps, {}> {
    public render(): ReactElement {
        const mnemonic = this.props.register.mnemonic.split(" ");
        const randArray = getRandomIntArray(12);
        const correctAnswerIndex = randArray[getRandomInt(3)];

        return (
            <VerifyMnemonic
                question={`What’s the ${correctAnswerIndex + 1}th word in the mnemonic?`}
                answers={[mnemonic[randArray[0]], mnemonic[randArray[1]], mnemonic[randArray[2]]]}
                correctAnswer={mnemonic[correctAnswerIndex]}
                onCorrectAnswer={this.onCorrectAnswer}
                onInvalidAnswer={(): void => {}}
            />
        );
    }

    private onCorrectAnswer(): void {
        const { register, storeSigningKey } = this.props;

        const signingKey = Eth2HDWallet.getKeypair(register.mnemonic).privateKey.toHexString();
        storeSigningKey(signingKey);
    }
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
    }, dispatch);

export const SigningKeyVerifyContainer = connect(mapStateToProps, mapDispatchToProps)(SigningMnemonicQuestion);