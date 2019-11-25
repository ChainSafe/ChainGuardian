import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, number, select, object, array } from '@storybook/addon-knobs';
import { Validator } from "./Validator";
import { ValidatorSimple } from "./ValidatorSimple";

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

storiesOf('Validator', module).add('Validator simple', () => {
    const depositValue = number("deposit", 0.3403);
    const title = text("name","Validator 001");
    const statusValue = text("status","Not working");
    const publicKeyValue = text("public key","6ffa3d24c9c26877d4a8bfa87455f44666ce93b7e13a3f84");
    return <div >
            <ValidatorSimple
            name={title}
            status={statusValue}
            publicKey={publicKeyValue}
            deposit={depositValue}
            onExportClick={()=>console.log("")} 
            onRemoveClick={()=>console.log("")} 
            />
        </div>;
}).addDecorator(withKnobs);