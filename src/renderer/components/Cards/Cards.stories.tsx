import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, number, select, object, array } from '@storybook/addon-knobs';
import { ValidatorStats } from "./Cards";

storiesOf('Validator', module).add('Validator Stats', () => {
    
    const text = array("text",["Return (ETH)","ROI"]);
    const value = number("percent", 10)
    return <div >
            <ValidatorStats text={text} percent={value}/>
        </div>;
}).addDecorator(withKnobs);