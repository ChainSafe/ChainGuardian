import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, number, select, object, array } from '@storybook/addon-knobs';
import { VerifyMnemonic } from './VerifyMnemonic';

storiesOf('Verify Mnemonic', module).add('Verify Mnemonic', () => {
    const question = text("question", "What's the 4th word in the mnemonic?");
    const answers = array("answers",["Accept","Call","Iguanas"]);
    const correctAnswer = text("correct answer", "Iguanas")
    return <div >
            <VerifyMnemonic 
                question={question}
                answers={answers}
                correctAnswer={correctAnswer}
                onCorrectAnswer={(): void => console.log("correct")}
                onInvalidAnswer={(): void => console.log("invalid")}/>
        </div>;
}).addDecorator(withKnobs);