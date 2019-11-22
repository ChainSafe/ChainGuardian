import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, number, select, object, array } from '@storybook/addon-knobs';
import { ValidatorCard, NodeCard } from "./Cards";

storiesOf('Validator', module).add('Validator Card', () => {
    
    const textArrayValue = array("text",["Return (ETH)","ROI"]);
    const numberValue = number("number value", 20);
    // const mainValue = text("value","+10%");
    return <div >
            <ValidatorCard value={numberValue} textArray={textArrayValue}/>
        </div>;
}).addDecorator(withKnobs);

storiesOf('Validator', module).add('Node Card', () => {
    
    const textArrayValue = array("text",["Beacon Node","www.beacon.ethereum.org"]);
    const numberValue = number("number value", 250);
    // const mainValue = text("value","+10%");
    return <div >
            <NodeCard onClick={()=>{console.log("")}} value={numberValue} textArray={textArrayValue}/>
        </div>;
}).addDecorator(withKnobs);