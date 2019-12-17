import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, number, select } from '@storybook/addon-knobs';
import { UptimeGraph} from './UptimeGraph';

storiesOf('UptimeGraph', module).add('UptimeGraph', () => {
    
    return <UptimeGraph 
    getData={async ()=>{
        return(
            [
                {up: 100, down: 20},
                {up: 90, down: 30},
                {up: 110, down: 10},
                {up: 105, down: 15},
                {up: 80, down: 40},
                {up: 95, down: 25},
                {up: 120, down: 0},
                {up: 120, down: 0},
                {up: 105, down: 15},
                {up: 115, down: 5},
          ]
        )
    }} />
}).addDecorator(withKnobs);
