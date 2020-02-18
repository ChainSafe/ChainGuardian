import * as React from "react";
import {ButtonInverted, ButtonDestructive} from "../Button/ButtonStandard";
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
    const [clicked, setClicked] = useState(false);
    function isCorrect (
        answer: string, 
        correctAnswer: string, 
        onCorrectAnswer: () => void,
        onInvalidAnswer: () => void): void {
        answer === correctAnswer ? onCorrectAnswer() : onInvalidAnswer();
        setClicked(true);
    }

    return(
        <div className="verify-mnemonic-container">
            <h1>{props.question}</h1>
            <div className="verify-button-container">
                {props.answers.map(answer => {
                    if(clicked && (answer === props.correctAnswer)){
                        return (
                            <ButtonInverted
                                disabled={clicked}
                                key={answer}
                                onClick={(): void => isCorrect(
                                    answer,
                                    props.correctAnswer,
                                    props.onCorrectAnswer,
                                    props.onInvalidAnswer)}>
                                {answer}
                            </ButtonInverted>);
                    } else if(clicked && (answer !== props.correctAnswer)){
                        return (
                            <ButtonDestructive 
                                disabled={clicked} 
                                key={answer} 
                                onClick={(): void => isCorrect(
                                    answer, 
                                    props.correctAnswer, 
                                    props.onCorrectAnswer, 
                                    props.onInvalidAnswer)}>
                                {answer}
                            </ButtonDestructive>);
                    } else{
                        return (
                            <ButtonInverted
                                datafield={(answer === props.correctAnswer).toString()}
                                disabled={clicked}
                                key={answer} 
                                onClick={(): void => isCorrect(
                                    answer, 
                                    props.correctAnswer, 
                                    props.onCorrectAnswer, 
                                    props.onInvalidAnswer)}>
                                {answer}
                            </ButtonInverted>);
                    }
                })}
            </div>
        </div>
    );
};


