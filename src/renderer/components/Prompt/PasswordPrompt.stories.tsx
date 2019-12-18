import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { button, withKnobs } from '@storybook/addon-knobs';
import { ISubmitStatus } from './InputPrompt';
import { Background } from '../Background/Background';
import { useState } from 'react';
import { PasswordPrompt } from './PasswordPrompt';

storiesOf('Password prompt', module).add('Password input', () => {
    const [visible, setVisible]=useState(false);

    const handler = () => setVisible(true);
    button("show prompt", handler);

    return <div>
        <PasswordPrompt
            display={visible}
            onSubmit={(password: string): ISubmitStatus => {
                if (password === "password") {
                    setVisible(false);
                    return {valid: true};
                } else {
                    setVisible(true);
                    return {valid: false, errorMessage: "Error"};
                }
            }}
        />
        <Background />
    </div>
}).addDecorator(withKnobs);