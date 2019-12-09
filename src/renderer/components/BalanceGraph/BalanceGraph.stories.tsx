import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, number, select } from '@storybook/addon-knobs';
import { BalanceGraph, IntervalEnum } from './BalanceGraph';

storiesOf('BalanceGraph', module).add('BalanceGraph', () => {
    
    return <BalanceGraph 
    defaultInterval={IntervalEnum.MONTH}
    getData={async ()=>{
        return(
            [2356,3213,8934,7924,7924,1245,3456,5673,2124,
                1002,4143,4143,4143,4143,3234,3245,
                4325,2333,5673,4623,1982,6753,5432,3463,
                1245,3341,2221,2234,3255,3255,3255,6544,
                5522,5522,5522,5522,5522,5522,5522,5522,
                4621,3111,1255,3220,2000,4335,5654,3245,3453,
                6777,6777,6777,6777,6777,6777,4000,4000,4000,1000,1200
            ]
        )
    }} />
}).addDecorator(withKnobs);
