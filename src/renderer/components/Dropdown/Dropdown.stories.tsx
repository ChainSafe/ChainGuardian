import * as React from 'react';
import {useState} from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, number, select, object, array } from '@storybook/addon-knobs';
import { Dropdown } from "./Dropdown";

storiesOf('Dropdown', module).add('Dropdown', () => {
    const options = array("options",["All networks","Mainnet","Testnet","Networkname #1"]);
    const [current, setCurrent] = useState(0);
    return <div style={{height: "500px"}}>
            <Dropdown current={current} onChange={(selected)=>setCurrent(selected)} options={options}/>
        </div>;
}).addDecorator(withKnobs);