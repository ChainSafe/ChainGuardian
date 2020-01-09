import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, number, select, object, array } from '@storybook/addon-knobs';
import { Validator } from "./Validator";
import { ValidatorSimple } from "./ValidatorSimple";

storiesOf('Validator', module).add('Validator Component', () => {
    const stats = {
        roi: 10,
        balance: 0.1206,
        uptime: 92
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
    const title = text("name","001");
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
    const title = text("name","001");
    const statusValue = text("status","Not working");
    const publicKeyValue = text("public key","0x92fffcc44e690220c190be41378baf6152560eb13fa73bdf8b45120b56096acc4b4e87a0e0b97f83e48f0ff4990daa18");
    const privateKeyValue = text("private key","0xd68ffdb8b9729cb02c5be506e9a2fad086746b4bdc2f50fb74d10ac8419c5259");
    const passwordValue = text("password","mock");
    return <div >
            <ValidatorSimple
            password={passwordValue}
            privateKey={privateKeyValue}
            name={title}
            status={statusValue}
            publicKey={publicKeyValue}
            deposit={depositValue}
            onExportClick={()=>console.log("")} 
            onRemoveClick={()=>console.log("")} 
            />
        </div>;
}).addDecorator(withKnobs);