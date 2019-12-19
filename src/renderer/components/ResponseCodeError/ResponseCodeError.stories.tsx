import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, number, select } from '@storybook/addon-knobs';
import { ResponseCodeError} from './ResponseCodeError';

storiesOf('ResponseCodeError', module).add('ResponseCodeError', () => {
    const dataDay = [{ name: 'Success', value: 400 },{ name: 'Warning', value: 200 },{ name: 'Error', value: 2 },];
    const dataWeek = [{ name: 'Success', value: 2000 },{ name: 'Warning', value: 500 },{ name: 'Error', value: 400 },];
    const dataMonth = [{ name: 'Success', value: 40000 },{ name: 'Warning', value: 6000 },{ name: 'Error', value: 1000 },];
      const func =async (x) => {
        console.log(x);
        if (x==="day") return dataDay;
        if (x==="week") return dataWeek;
        if (x==="month") return dataMonth;
      }

    
    return <ResponseCodeError 
      getData={func}
    
    />
    
}).addDecorator(withKnobs);