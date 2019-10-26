import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, number, select, object } from '@storybook/addon-knobs';
import { StepNavigation } from './StepNavigation';

storiesOf('Step Navigation', module).add('Step Navigation', () => {
    const selected= number("current", 1,);
    const d = [
        {
            stepId: 1,
            stepName:"Signing key"
        },
        {
            stepId: 2,
            stepName:"Withdrawal key"
        },
        {
            stepId: 3,
            stepName:"Password"
        },
        {
            stepId: 4,
            stepName:"Configure"
        },
        {
            stepId: 5,
            stepName:"Consent"
        },
    ];
    const array = object("steps", d);
    return <div >
            <StepNavigation steps={array} current={selected}/>
        </div>;
}).addDecorator(withKnobs);