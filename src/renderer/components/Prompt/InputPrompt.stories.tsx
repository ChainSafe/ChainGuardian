import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { button, withKnobs } from '@storybook/addon-knobs';
import { InputPrompt, ISubmitStatus } from './InputPrompt';
import { Background } from '../Background/Background';
import { useState } from 'react';

storiesOf('Input prompt', module).add('Prompt input', () => {
    const [visible, setVisible]=useState(false);

    const handler = () => setVisible(true);
    button("show prompt", handler);

    return <div>
        <InputPrompt
            display={visible}
            onSubmit={(password: string): ISubmitStatus => {
                if (password === "password") {
                    setVisible(false);
                    return {errorMessage: ""};
                } else {
                    setVisible(true);
                    return {errorMessage: "Error"};
                }
            }}
            title={"Enter password"}
            />
        <Background />
    </div>
}).addDecorator(withKnobs);