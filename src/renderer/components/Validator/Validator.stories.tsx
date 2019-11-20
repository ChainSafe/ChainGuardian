import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, number, select, object, array } from '@storybook/addon-knobs';
import { Validator } from "./Validator";

storiesOf('Validator', module).add('Validator Component', () => {
    

    const x = [
        {
            id: "ime",
            url: "nekiurl",
            respTime: 22
        },{
            id: "ime2",
            url: "nekiurl2",
            respTime: 21
        }
    ]
    // const textArrayValue = array("text",["Return (ETH)","+10%","ROI"]);
    // const mainValue = text("value","+10%");
    return <div >
            <Validator beaconNodes={x}/>
        </div>;
}).addDecorator(withKnobs);