import React, {Component, ReactElement} from "react";
import {VerifyMnemonic} from "../../../components/VerifyMnemonic/VerifyMnemonic";
import {History} from "history";
import {getRandomIntArray, getRandomInt} from "../../../services/mnemonic/utils/random";
import store from "../../../store/index";
import {connect} from "react-redux";


class SigningMnemonicQuestion extends Component<{ history: History }, {}> {
    public render(): ReactElement {
        const x = store.getState().mnemonicReducer.mnemonic;
        const randArray = getRandomIntArray(12);
        const correctAnswerIndex = randArray[getRandomInt(3)];
        console.log(x);
        console.log(x[correctAnswerIndex]);

        
        return (
            <VerifyMnemonic 
                question={`What’s the ${correctAnswerIndex+1}th word in the mnemonic?`}
                answers={[x[randArray[0]],x[randArray[1]],x[randArray[2]]]}
                correctAnswer={x[correctAnswerIndex]}
                onCorrectAnswer={(): void=>console.log("correct")}
                onInvalidAnswer={(): void=>console.log("invalid")}
            ></VerifyMnemonic>
        );
    }
}
export default connect()(SigningMnemonicQuestion)