import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { MultipleInputVertical } from './MultipleInputVertical';
import { IInputFormProps } from '../Input/InputForm';
import * as React from 'react';


storiesOf('Multiple Input Form Vertical', module).add('Multiple Input Form Vertical', () => {
    const inputs: Array<IInputFormProps> = [
        {
            inputId: "first",
            label: "First field",
            placeholder: "First field placeholder"
        },
        {
            inputId: "second",
            label: "Second field",
            placeholder: "Second field placeholder"
        }
    ];
    return <MultipleInputVertical inputs={inputs}/>
}).addDecorator(withKnobs)