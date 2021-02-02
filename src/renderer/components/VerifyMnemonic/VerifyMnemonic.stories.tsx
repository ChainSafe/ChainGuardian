import * as React from "react";
import {storiesOf} from "@storybook/react";
import {withKnobs, text, array} from "@storybook/addon-knobs";
import {VerifyMnemonic} from "./VerifyMnemonic";

storiesOf("Verify Mnemonic", module)
    .add("Verify Mnemonic", () => {
        const question = text("question", "What's the 4th word in the mnemonic?");
        const answers = array("answers", ["Accept", "Call", "Iguanas"]);
        const correctAnswer = text("correct answer", "Iguanas");

        // eslint-disable-next-line no-console
        const handleAnswer = (answers: string) => (): void => console.log(answers);

        return (
            <div>
                <VerifyMnemonic
                    question={question}
                    answers={answers}
                    correctAnswer={correctAnswer}
                    onCorrectAnswer={handleAnswer("correct")}
                    onInvalidAnswer={handleAnswer("invalid")}
                />
            </div>
        );
    })
    .addDecorator(withKnobs);
