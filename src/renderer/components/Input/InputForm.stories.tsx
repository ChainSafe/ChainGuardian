import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs';
import { InputForm} from './InputForm';

storiesOf('Input Form', module).add('Input Form', () => {
    return  <InputForm />;
}).addDecorator(withKnobs);