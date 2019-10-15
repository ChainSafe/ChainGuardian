import * as React from 'react';
import { storiesOf } from '@storybook/react';
import {Background} from './Background';

storiesOf('Background', module).add('transparent', () => {
    return <Background></Background>;
});
