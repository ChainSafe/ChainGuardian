import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, number, select, object, array } from '@storybook/addon-knobs';
import { Validator } from "./Validator";

storiesOf('Validator', module).add('Validator Component', () => {
    const stats = {
        roi: 10,
        balance: 0.1206,
        uptime: 92.1
    }    
    let node = [];
    const index = number("number of nodes",2);
    for (let i = 0; i < index; i++) {
        node.push({
            id: "BeaconNode",
            url: "rocketsonic.hr",
            respTime: 21
        })
    }

    const statsValue = object("stats",stats);
    const title = text("name","Validator 001");
    return <div >
            <Validator
            name={title}
            onBeaconNodeClick={()=>console.log("")} 
            onDetailsClick={()=>console.log("")} 
            onRemoveClick={()=>console.log("")} 
            onAddNodeClick={()=>console.log("")}
            stats={statsValue} 
            beaconNodes={node}/>
        </div>;
}).addDecorator(withKnobs);