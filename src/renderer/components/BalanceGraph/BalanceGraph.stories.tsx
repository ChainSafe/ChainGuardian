import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, number, select } from '@storybook/addon-knobs';
import { BalanceGraph } from './BalanceGraph';
import { IntervalEnum } from './BalanceGraph';

storiesOf('BalanceGraph', module).add('BalanceGraph', () => {
    
    return <BalanceGraph 
    defaultInterval={IntervalEnum.DAY}
    onOptionClick={()=>{console.log("")}}
    getData={()=>{
        return(
            [2356,3213,3453,5674,6783,1245,3456]
        )
    }} />
}).addDecorator(withKnobs);
