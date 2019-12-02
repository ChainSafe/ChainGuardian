import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, number, select } from '@storybook/addon-knobs';
import { BalanceGraph } from './BalanceGraph';

storiesOf('BalanceGraph', module).add('BalanceGraph', () => {
    const textValue = text("value", "Test string for copy");

    return <BalanceGraph />
}).addDecorator(withKnobs);
