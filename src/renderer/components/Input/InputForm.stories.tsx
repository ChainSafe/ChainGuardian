import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, number, select } from '@storybook/addon-knobs';
import { InputForm} from './InputForm';
import { string } from 'prop-types';

storiesOf('Input Form', module).add('Input Form', () => {
    const options = {
        gray: "",
        success: true,
        error: false,
    }
    const defaultValue = undefined;
    const label = text("label text", "Input")
    const validValue = select("valid", options, defaultValue,);
    const eMessage = text("error message", "Error message");
    return  <InputForm valid={validValue} label={label} errorMessage={eMessage}/>;
}).addDecorator(withKnobs);