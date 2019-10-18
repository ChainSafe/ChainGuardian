import * as React from 'react';
import { storiesOf } from '@storybook/react';
import {Background} from './Background';
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs';

storiesOf('Background', module).add('background', () => {
    const value = boolean('basic', false);
    return <Background  basic={value}><h1>Titleeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee</h1></Background>;
}).addDecorator(withKnobs);
