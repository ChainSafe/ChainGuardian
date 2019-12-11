import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, number, select } from '@storybook/addon-knobs';
import { ErrorGraph} from './ErrorGraph';

storiesOf('ErrorGraph', module).add('ErrorGraph', () => {
    
    return <ErrorGraph 
    getData={async ()=>{
        return(
            [2,5,9,12,1,5,6,8,10,10,11,5,7,8
            ]
        )
    }} />
}).addDecorator(withKnobs);
