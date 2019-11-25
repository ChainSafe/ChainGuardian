import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, number, select, object, array } from '@storybook/addon-knobs';
import { ValidatorCard } from "./ValidatorCard";
import { NodeCard } from "./NodeCard";

storiesOf('Validator', module).add('Validator Card', () => {
    const numberValue = number("number value", 20);
    const titleValue = text("title", "Return(ETH)");
    const typeValue = text("type", "ROI");
    return <div >
            <ValidatorCard value={numberValue} title={titleValue} type={typeValue}/>
        </div>;
}).addDecorator(withKnobs);

storiesOf('Validator', module).add('Node Card', () => {
    
    const numberValue = number("number value", 250);
    const titleValue = text("title", "Beacon Node");
    const urlValue = text("url", "www.beacon.ethereum.org");
    return <div >
            <NodeCard onClick={()=>{console.log("")}} value={numberValue} title={titleValue} url={urlValue}/>
        </div>;
}).addDecorator(withKnobs);