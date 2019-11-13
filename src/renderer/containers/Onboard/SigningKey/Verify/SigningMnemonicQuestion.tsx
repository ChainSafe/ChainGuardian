import React, {Component, ReactElement} from "react";
import {VerifyMnemonic} from "../../../../components/VerifyMnemonic/VerifyMnemonic";
import {connect} from "react-redux";
import {RouteComponentProps} from "react-router";
import {getRandomInt, getRandomIntArray} from "../../../../services/mnemonic/utils/random";
import {IRootState} from "../../../../reducers";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IProps extends Pick<RouteComponentProps, "history"> {

}

class SigningMnemonicQuestion extends Component<IProps &  Pick<IRootState, "register">, {}> {
    public render(): ReactElement {
        const mnemonic = this.props.register.mnemonic.split(" ");
        const randArray = getRandomIntArray(12);
        const correctAnswerIndex = randArray[getRandomInt(3)];

        return (
            <VerifyMnemonic
                question={`What’s the ${correctAnswerIndex + 1}th word in the mnemonic?`}
                answers={[mnemonic[randArray[0]], mnemonic[randArray[1]], mnemonic[randArray[2]]]}
                correctAnswer={mnemonic[correctAnswerIndex]}
                onCorrectAnswer={(): void => console.log("correct")}
                onInvalidAnswer={(): void => console.log("invalid")}
            />
        );
    }
}

const mapStateToProps = (state: IRootState): Pick<IRootState, "register"> => ({
    register: state.register
});

export const SigningKeyVerifyContainer = connect(mapStateToProps)(SigningMnemonicQuestion);