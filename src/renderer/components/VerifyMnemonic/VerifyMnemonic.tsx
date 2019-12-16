import * as React from "react";
import {ButtonInverted, ButtonDestructive, ButtonPrimary} from "../Button/ButtonStandard";
import {useState} from "react";

export interface IVerifyMnemonicProps {
    question: string;
    answers: string[];
    correctAnswer: string;
    onCorrectAnswer:  () => void;
    onInvalidAnswer: () => void;
}

export const VerifyMnemonic: React.FunctionComponent<IVerifyMnemonicProps> = (
    props: IVerifyMnemonicProps) => {
    const [clicked, setClicked] = useState();
    function isCorrect (
        answer: string, 
        correctAnswer: string, 
        onCorrectAnswer: () => void,
        onInvalidAnswer: () => void): void {
        answer === correctAnswer ? onCorrectAnswer() : onInvalidAnswer();
        setClicked(answer);
    }

    return(
        <div className="verify-mnemonic-container">
            <h1>{props.question}</h1>
            <div className="verify-button-container">
                {props.answers.map(answer => {
                    if(clicked===answer && (answer === props.correctAnswer)){
                        return (
                            <ButtonPrimary key={answer} onClick={(): void => isCorrect(
                                answer, 
                                props.correctAnswer, 
                                props.onCorrectAnswer, 
                                props.onInvalidAnswer)}>{answer}</ButtonPrimary>);
                    } else if(clicked===answer && (answer !== props.correctAnswer)){
                        return (
                            <ButtonDestructive key={answer} onClick={(): void => isCorrect(
                                answer, 
                                props.correctAnswer, 
                                props.onCorrectAnswer, 
                                props.onInvalidAnswer)}>{answer}</ButtonDestructive>);
                    } else{
                        return (
                            <ButtonInverted key={answer} onClick={(): void => isCorrect(
                                answer, 
                                props.correctAnswer, 
                                props.onCorrectAnswer, 
                                props.onInvalidAnswer)}>{answer}</ButtonInverted>);
                    }
                })}
            </div>
        </div>
    );
};


