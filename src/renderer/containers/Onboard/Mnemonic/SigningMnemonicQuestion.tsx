import React, {Component, ReactElement} from "react";
import {VerifyMnemonic} from "../../../components/VerifyMnemonic/VerifyMnemonic";
import {History} from "history";

export default class SigningMnemonicQuestion extends Component<{ history: History }, {}> {

    public render(): ReactElement {
        return (
            <VerifyMnemonic 
                question="What’s the Nth word in the mnemonic?"
                answers={["TEST1","TEST2","TEST3"]}
                correctAnswer="TEST2"
                onCorrectAnswer={(): void=>console.log("correct")}
                onInvalidAnswer={(): void=>console.log("invalid")}
            ></VerifyMnemonic>
        );
    }

}
