import * as React from 'react';
import { storiesOf } from '@storybook/react';
import {Background} from './Background';
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs';
import { ButtonPrimary } from '../Button/ButtonStandard';
import { Dropdown } from '../Dropdown/Dropdown';

storiesOf('Background', module).add('background', () => {
    const value = boolean('basic', false);
    return <Background  basic={value}><h1>Titleeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee</h1></Background>;
}).addDecorator(withKnobs);

// background with top bar

storiesOf('Background with top bar', module).add('background-top-bar', () => {
    const value = boolean('basic', false);
    return <Background  basic={value} topBar={topBar}><h1>Titleeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee</h1></Background>;
}).addDecorator(withKnobs);

const topBar =
    <div className={"validator-top-bar"}>
        <ButtonPrimary>Sample Button</ButtonPrimary>
    </div>;
