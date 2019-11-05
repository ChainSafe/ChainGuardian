import * as React from "react";
import {ButtonPrimitive} from "../Button/ButtonStandard";

export interface IVerifyMnemonicProps {
    question: string;
    answers: string[];
    correctAnswer: string;
    onCorrectAnswer:  () => void;
    onInvalidAnswer: () => void;
}

export const VerifyMnemonic: React.FunctionComponent<IVerifyMnemonicProps> = (
    props: IVerifyMnemonicProps) => {

    function isCorrect (
        answer: string, 
        correctAnswer: string, 
        onCorrectAnswer: () => void,
        onInvalidAnswer: () => void): void {
        answer === correctAnswer ? onCorrectAnswer() : onInvalidAnswer();
    }

    return(
        <div className="verify-mnemonic-container">
            <h1>{props.question}</h1>
            <div className="verify-button-container">
                {props.answers.map(answer => {
                    return <ButtonPrimitive key={answer} onClick={(): void => isCorrect(
                        answer, 
                        props.correctAnswer, 
                        props.onCorrectAnswer, 
                        props.onInvalidAnswer)}>{answer}</ButtonPrimitive>;
                })}
            </div>
        </div>
    );
};


