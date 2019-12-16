import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, number, select } from '@storybook/addon-knobs';
import { ErrorFrequencGraph} from './ErrorFrequencyGraph';

storiesOf('ErrorFrequencGraph', module).add('ErrorFrequencGraph', () => {
    
    return <ErrorFrequencGraph 
    getData={async ()=>{
        return(
            [2,5,9,12,1,5,6,8,10,10,11,5,7,8
            ]
        )
    }} />
}).addDecorator(withKnobs);
