import * as React from 'react';
import { storiesOf } from '@storybook/react';
import {Loading} from './Loading';
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs';

storiesOf('Loading', module).add('Loading', () => {
    const value = boolean('visible', true);
    const title = text('title', "Loading...")
    return <Loading visible={value} title={title}></Loading>;
}).addDecorator(withKnobs);
